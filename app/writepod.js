'use strict'

import { buttonCreate } from './ui'
import { initDragDropFile } from './dragdrop'
import { session } from './login'
import {API_URL, PAYMENT_TOKEN} from './config'
import {
    addUrl,
    addStringNoLocale,
    createSolidDataset,
    createThing,
    getSolidDataset,
    getThingAll,
    removeThing,
    saveSolidDatasetAt,
    setThing,
    overwriteFile,
    getSourceUrl,
    getFile,
    isRawData,
    getContentType
} from '@inrupt/solid-client'

import { SCHEMA_INRUPT, RDF, AS } from '@inrupt/vocab-common-rdf'

const mediaContentPath = 'Media-Content/NewList/'

let newSellObj = {}

let fileToSend = null

const urlApiGetItems = API_URL+'/getitems'

let listOfItems = {}

const session_uPayment = PAYMENT_TOKEN

async function createFileInfo() {
   
    const item_name = document.getElementById('itemname').value
    const item_price = document.getElementById('price').value
    const item_payment = document.getElementById('paymententry').value
   
    if (newSellObj.resourceUrl && item_name) {
        const SELECTED_POD = document.getElementById('select-pod').value
        const resourceUrl = `${SELECTED_POD}${mediaContentPath}${item_name}`
        let myNewResource
        try {
            myNewResource = await getSolidDataset(resourceUrl, { fetch: session.fetch })
            let items = getThingAll(myNewResource)
            items.forEach((item) => {
                myNewResource = removeThing(myNewResource, item)
            })
        } catch (error) {
            if (typeof error.statusCode === 'number' && error.statusCode === 404) {
                myNewResource = createSolidDataset()
            } else {
                console.error(error.message)
            }
        }

        // TODO: create a Thing with multiple attributes
        let item = createThing({ name: 'price' })
        item = addUrl(item, RDF.type, AS.Article)
        item = addStringNoLocale(item, SCHEMA_INRUPT.productID, item_price)
        myNewResource = setThing(myNewResource, item)

        try {

            let savedResource = await saveSolidDatasetAt(
                resourceUrl,
                myNewResource,
                { fetch: session.fetch }
            )
            if (savedResource) {
                newSellObj.price = item_price
                newSellObj.name = item_name
                newSellObj.payment = item_payment
                newSellObj.sellerWebId = session.info.webId
                const sendToBackend = await sendNewItemInfo(newSellObj)
                if(sendToBackend.ok){
                    console.log('Sent to backend ', sendToBackend)
                    getListItems()
                }                
            }

        } catch (error) {
            console.log(error)
        }

    } else {
        alert('Please attach a file')
    }
}

function handleFiles(files) {
    
    const podUrl = document.getElementById('select-pod').value
    if (podUrl) {
        const fileList = Array.from(files)
        fileToSend = fileList[0]
    } else {
        alert('You must select a Pod first')
    }
}

async function writeFileToPod(file, targetFileURL) {
    let resp = {error:null}
    try {
        const savedFile = await overwriteFile(
            targetFileURL,
            file,
            { contentType: file.type, fetch: session.fetch }
        )
        const location = getSourceUrl(savedFile) 
        if(location){
            console.log('savedFile', savedFile)
            resp = {ok:true, resp: savedFile}
            newSellObj.resourceUrl = location
        }              

    } catch (error) {
        console.error(error)
        resp.error = error
    }
    return resp
}

async function sendNewItemInfo(fileInfo) {
    const header = {
        'Content-Type': 'application/json',
    }
    const newItemResp = await genericPost(fileInfo, API_URL+'/newitem', header)
    return newItemResp     
}

async function askForAccess(id) {
    const itemIs = listOfItems[id]

    const dataPurchase = {
        resourceUrl: itemIs.resourceUrl,
        buyerWebId: session.info.webId
    }
    const header = {
        'Content-Type': 'application/json',
    }
    const accessResp = await genericPost(dataPurchase, API_URL+'/buy', header)
    return accessResp       
}

async function getListItems() {
    const data = await getItemsData(urlApiGetItems).catch(catchError)
    const container = document.getElementById('marketlist')
    // TODO: avoid forcing cleaning UI due two multiple page loads
    container.innerHTML = ''
    for (let item of data) {
        listOfItems[item.id] = item
        const nodeLi = createHTMLListElement(JSON.stringify(item))
        const nodeButtonBuy = createHTMLButtonElement('$Buy', item.id)
        const nodeButtonFetch = createHTMLButtonElement('Fetch', item.id)
        container.appendChild(nodeLi)
        container.appendChild(nodeButtonBuy)
        container.appendChild(nodeButtonFetch)
        nodeButtonBuy.addEventListener('click', async function () {
            await startPurchaseProcess(this.id)
        })
        nodeButtonFetch.addEventListener('click', async function () {
            await fetchResource(this.id)
        })
    }
}

async function readFileFromPod(fileURL) {
    try {
        
        const file = await getFile(
            fileURL,               
            { fetch: session.fetch }       
        )        
        console.log(`Fetched a ${getContentType(file)} file from ${getSourceUrl(file)}.`)
        console.log(`The file is ${isRawData(file) ? "not " : ""}a dataset.`)
        return { ok: true, content: file }

    } catch (err) {
        console.log(err)
        return { error: err }
    }
}

async function fetchResource(id) {
    const itemIs = listOfItems[id]
    const resultFileAccess = await readFileFromPod(itemIs.resourceUrl)
    if (resultFileAccess.ok) {
        const mediaElem = document.querySelector('#audiovideo')
        if (!mediaElem) {
            const video = document.createElement('video')
            video.id = 'audiovideo'
            video.controls = true
            video.muted = false
            video.height = 240
            video.width = 320
            const box = document.getElementById('localStoraged')
            box.appendChild(video)
        }
        
        document.querySelector('#audiovideo').src = URL.createObjectURL(resultFileAccess.content)

    } else {
        alert(resultFileAccess.error)
    }
}

async function startPurchaseProcess(id) {
    if(session.info.isLoggedIn){
        let fromPerson = prompt('Please enter your payment user name', '')
        if (fromPerson !== null) {
            const thePayment = await sendMoney(id, fromPerson)
            if(thePayment.ok){
                console.log(thePayment)
                // TODO: check if thePayment.resp.successfulPayment is true
                // Ideal Flow: the buyer pays the backend and the backend pays the seller
                // so there´s no need from the backend to validate or confirma buyer's payment
                // it receives the money and then is able to pay the seller
                const respAccess = await askForAccess(id)                
                if(respAccess.ok){
                    alert('Access Granted')
                }                
            }            
        }
    } else {
        alert('Please Login before Buying')
    }
    
}

function catchError(err) {
    console.log('Error ', err)
}

function createHTMLListElement(text) {
    let li = document.createElement('li')
    li.textContent = text
    return li
}

function createHTMLButtonElement(text, id) {
    let button = document.createElement('button')
    button.textContent = text
    button.id = id
    return button
}

async function getItemsData(_url) {
    const response = await fetch(_url)
    return await response.json()
}

async function sendMoney(itemId, fromUser) {
    const itemIs = listOfItems[itemId]
    const amountConverted = parseFloat(itemIs.price) * 1000000000
    const dataPurchase = {
        amount: amountConverted,
        destinationPaymentPointer: itemIs.payment || "$money.ilpv4.dev/gilpanal"
    }
    const header = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${session_uPayment}`
    }
    const moneyResp = await genericPost(dataPurchase, `https://hermes-rest.ilpv4.dev/accounts/${fromUser}/pay`, header)
    return moneyResp   
}

async function genericPost(data, url, headers){
    let reply = {error:null}
    try {
        const sendRqst = await fetch(url, {

            credentials: 'include',
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data),
        })
        const respJson = await sendRqst.json()
        reply = {ok: true, resp:respJson}
    } catch(err){
        reply.error = err
    }
   
    return reply  
}

buttonCreate.onclick = async () => {
    const podUrl = document.getElementById('select-pod').value
    if(podUrl){
        const respWriteFile = await writeFileToPod(fileToSend, `${podUrl}${mediaContentPath}${fileToSend.name}`)
        if(respWriteFile.ok){
            await createFileInfo()
        }        
    }        
}

getListItems()

initDragDropFile(handleFiles)