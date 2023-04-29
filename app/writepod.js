'use strict'

import { buttonCreate } from './ui'
import { initDragDropFile } from './dragdrop'
import { session } from './login'

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

const urlApiGetItems = 'http://localhost:3001/api/getitems'

let listOfItems = {}

const session_uPayment = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1rTTJPRGMxUVRKR05qSXlRelJFUmtKQk5qRTNNMFpCTkRsRFJEQkVSVFF3UWpWRk5VSkNNdyJ9.eyJpc3MiOiJodHRwczovL3hwcmluZ3NhbmRib3guYXV0aDAuY29tLyIsInN1YiI6ImdpdGh1YnwzNjAwNTQwIiwiYXVkIjpbImh0dHBzOi8vamMuaWxwdjQuZGV2IiwiaHR0cHM6Ly94cHJpbmdzYW5kYm94LmF1dGgwLmNvbS91c2VyaW5mbyJdLCJpYXQiOjE2ODI3OTc5NDYsImV4cCI6MTY4Mjg4NDM0NiwiYXpwIjoiMHIxZnJaNTlleWxEc01IM2FjVmVTSkQ1S0k2cHVFaG8iLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIn0.0LaARYA2nuXNS4jgEN8RDhRrbuIcRqZonEMrRK0ghcnzkoc11vBqw4wi3Ygg33ZwTLElE4OJIJjud_AM4MhpzWDjT4UBbweGcKS_yeKztmzCtZWgpUGbXTW-zVnYLsLnTiZ4uMV6i9Hpt_x9Cp11f8JcQOeC4aG-M-nt5GO8CFDVPAiMG73_dBptYzSLbjUI5lVioStAUCqr1WnFzkvxE-uKkfkhGV_Rgqwj9sRvAVO-Mha9P9RMm7vm9f-CKQY-7HfYUiv0JKvnUpgzrrYIBIbXCFzeQ4atUxTb5H4DvVEAIotvL2czpNjExT-pMpQRE35-EFpTkuF_jxG_inspcQ'

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
                const sendToBackend = await sendPost(newSellObj) // needs to be fixed
                console.log('Sent to backend ', sendToBackend)
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
        fileList.forEach(file => {
            writeFileToPod(file, `${podUrl}${mediaContentPath}${file.name}`)
        })
    } else {
        alert('You must select a Pod first')
    }
}

async function writeFileToPod(file, targetFileURL) {
    
    try {
        const savedFile = await overwriteFile(
            targetFileURL,
            file,
            { contentType: file.type, fetch: session.fetch }
        )
        const location = getSourceUrl(savedFile)        
        newSellObj.resourceUrl = location

    } catch (error) {
        console.error(error)
    }
}

async function sendPost(fileInfo) {

    await fetch('http://localhost:3001/api/newitem', {

        credentials: 'include',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(fileInfo),
    })
    .then((response) => response.json())
    .then((data) => {
        console.log('Success:', data)
        return data
    })
    .catch((error) => {
        console.error('Error:', error)
        return error
    })
}

async function askForAccess(id) {
    const itemIs = listOfItems[id]

    const dataPurchase = {
        resourceUrl: itemIs.resourceUrl,
        buyerWebId: session.info.webId
    }
    await fetch('http://localhost:3001/api/buy', {

        credentials: 'include',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataPurchase),
    })
    .then((response) => response.json())
    .then((data) => {
        console.log('Success:', data)
        return data
    })
    .catch((error) => {
        console.error('Error:', error)
        return error
    })
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
        // file is a Blob (see https://developer.mozilla.org/docs/Web/API/Blob)
        const file = await getFile(
            fileURL,               // File in Pod to Read
            { fetch: session.fetch }       // fetch from authenticated session
        )
        console.log(file)
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

    let fromPerson = prompt('Please enter your payment user name', '')
    if (fromPerson !== null) {
        await sendMoney(id, fromPerson)
        // TODO: if payment successful then ask for access
        // Ideal Flow: the buyer pays the backend and the backend pays the seller
        // so there´s no need from the backend to validate or confirma buyer's payment
        // it receives the money and then is able to pay the seller
        await askForAccess(id)
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

    await fetch(`https://hermes-rest.ilpv4.dev/accounts/${fromUser}/pay`, {

        credentials: 'include',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${session_uPayment}`
        },
        body: JSON.stringify(dataPurchase),
    })
    .then((response) => response.json())
    .then((data) => {
        console.log('Success:', data)
        return data
    })
    .catch((error) => {
        console.error('Error:', error)
        return error
    })
}

buttonCreate.onclick = function () {
    createFileInfo()    
}

getListItems()

initDragDropFile(handleFiles)