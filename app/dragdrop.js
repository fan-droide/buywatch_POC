'use strict'
// Source: https://medium.com/featurepreneur/how-to-create-drag-drop-file-upload-311e4ffeb56f
export function initDragDropFile(handleFiles){
    
    document.querySelectorAll('.drop-zone__input').forEach((inputElement) => {
        const dropZoneElement = inputElement.closest('.drop-zone')
    
        dropZoneElement.addEventListener('click', (e) => {
            inputElement.click()
        })
    
        inputElement.addEventListener('change', (e) => {
            if (inputElement.files.length) {
                updateThumbnail(dropZoneElement, inputElement.files[0])
                handleFiles(inputElement.files)
            }
        })
    
        dropZoneElement.addEventListener('dragover', (e) => {
            e.preventDefault()
            dropZoneElement.classList.add('drop-zone--over')
        })
        
        dropZoneElement && ['dragleave', 'dragend'].forEach((type) => {
            dropZoneElement.addEventListener(type, (e) => {
                dropZoneElement.classList.remove('drop-zone--over')
            })
        })
    
        dropZoneElement.addEventListener('drop', (e) => {
            e.preventDefault()
    
            if (e.dataTransfer.files.length) {
                inputElement.files = e.dataTransfer.files
                updateThumbnail(dropZoneElement, e.dataTransfer.files[0])
                handleFiles(e.dataTransfer.files)
            }
    
            dropZoneElement.classList.remove('drop-zone--over')
        })
    })
}


function updateThumbnail(dropZoneElement, file) {

    let thumbnailElement = dropZoneElement.querySelector('.drop-zone__thumb')

    // First time - remove the prompt
    if (dropZoneElement.querySelector('.drop-zone__prompt')) {
        dropZoneElement.querySelector('.drop-zone__prompt').remove()
    }

    // First time - there is no thumbnail element, create it
    if (!thumbnailElement) {
        thumbnailElement = document.createElement('div')
        thumbnailElement.classList.add('drop-zone__thumb')
        dropZoneElement.appendChild(thumbnailElement)
    }

    thumbnailElement.dataset.label = file.name
    thumbnailElement.style.backgroundImage = null   
}
