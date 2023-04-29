'use strict'
import { buttonLogin, selectorIdP } from './ui'
import {getMyPods} from './readpod'
import {
    login,
    handleIncomingRedirect,
    getDefaultSession,
    onSessionRestore
} from '@inrupt/solid-client-authn-browser'

export let session = getDefaultSession()

function loginToSelectedIdP() {
    const SELECTED_IDP = document.getElementById('select-idp').value

    return login({
        oidcIssuer: SELECTED_IDP,
        //clientId: 'http://localhost:3001/myappid.jsonld',
        redirectUrl: window.location.href,        
        clientName: 'Web App Permission'
    })
}

async function handleRedirectAfterLogin() {
    await session.handleIncomingRedirect({ restorePreviousSession: true })
    //session = getDefaultSession()
    console.log('Too many loads', session)
    if (session.info.isLoggedIn) {
        document.getElementById('myWebID').value = session.info.webId
        document.getElementById('read').hidden = false
        document.getElementById('write').hidden = false        
        getMyPods()        
    }
}

handleRedirectAfterLogin()

onSessionRestore((url)=>{    
    console.log('onSessionRestore', url)
 })

 buttonLogin.onclick = function () {
    loginToSelectedIdP()
}

selectorIdP.addEventListener('change', idpSelectionHandler)

function idpSelectionHandler() {
    if (selectorIdP.value === '') {
        buttonLogin.setAttribute('disabled', 'disabled')
    } else {
        buttonLogin.removeAttribute('disabled')
    }
}
