'use strict'
import { buttonCreate, selectorPod } from './ui'
import { session } from './login'

import {
    getPodUrlAll
} from '@inrupt/solid-client'

export async function getMyPods() {
    
    const webID = document.getElementById('myWebID').value
    const mypods = await getPodUrlAll(webID, { fetch: session.fetch })

    // TODO: for localhost there's a problem when retrieving the pod url
    // the list of PODs should not be harcoded
    if (mypods.length === 0) {
        const podUrl = webID.replace('profile/card#me','');
        mypods.push(podUrl)
    }
    mypods.forEach((mypod) => {
        let podOption = document.createElement('option')
        podOption.textContent = mypod
        podOption.value = mypod
        selectorPod.appendChild(podOption)
    })
}

selectorPod.addEventListener('change', podSelectionHandler)

function podSelectionHandler() {
    if (selectorPod.value === '') {
        buttonCreate.setAttribute('disabled', 'disabled')
    } else {
        buttonCreate.removeAttribute('disabled')
    }
}