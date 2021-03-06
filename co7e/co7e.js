/******************************************************************************
MIT License

The "co7e" is open-source, full stack Single Page Application(SPA) web framework with focus on Rapid Application Development(RAD) designed to be practical, lightweight, efficient, fast, secure and easy to learn.

Copyright (c) 2021 Ivan Ivanovic

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
******************************************************************************/

const co7e = {};

co7e.crud = params => new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = () => resolve(JSON.parse(xhr.responseText));
    
    let formData = new FormData();
    
    if (params.dataSource instanceof HTMLFormElement) {
        if (params.dataSource.reportValidity()) {
            formData = new FormData(params.dataSource);
        }
    } else if (params.dataSource instanceof FormData) {
        formData = params.dataSource;
    }
    
    if (params.upload) {
        xhr.upload.onprogress = e => {
            if (params.uploadProgressCallback instanceof Function) {
                params.uploadProgressCallback(Math.round(e.loaded / e.total * 100));
            }
        };
    }
    
    xhr.open('POST', params.script);
    xhr.send(formData);  
});

co7e.render = (renderer, template, data) => new Promise((resolve, reject) => {
    renderer.innerHTML = '';
        
    let rows = data;
        
    if (Array.isArray(rows) && rows.length > 0) {
        for (let row of rows) {
            const clone = template.content.cloneNode(true);

            for (let col in row) {
                    for (let el of clone.querySelectorAll(`[data-co7e-column="${col}"]`)) {
                        if (el instanceof HTMLImageElement || el instanceof HTMLVideoElement) {
                            el.setAttribute('src', row[col]);
                        } else if (el instanceof HTMLInputElement || el instanceof HTMLSelectElement || el instanceof HTMLTextAreaElement || el instanceof HTMLOptionElement) {
                            el.value = row[col];
                        } else if (el instanceof HTMLObjectElement) {
                            el.setAttribute('data', row[col]);
                        } else if (el instanceof HTMLAnchorElement) {
                            el.setAttribute('href', row[col]);
                        } else {
                            el.textContent = row[col];
                        }
                    }
                }

                renderer.appendChild(clone);
            }
        } else {
            let clone = template.content.cloneNode(true);
            renderer.appendChild(clone);
        }
    
    resolve(data);
});

co7e.view = (viewGroup, view) => {
    for (const view of document.querySelectorAll(`[data-co7e-view-group="${viewGroup}"] [data-co7e-view]`)) {
        view.classList.remove('co7e-show');
    }
            
    document.querySelector(`[data-co7e-view-group="${viewGroup}"] [data-co7e-view="${view}"]`).classList.add('co7e-show');
};

co7e.superuserArea = show => {
    if (show) {
        for (let superuserArea of document.querySelectorAll('[data-co7e-superuser-area]')) {
            superuserArea.classList.add('co7e-show');
        }
    } else {
        for (let superuserArea of document.querySelectorAll('[data-co7e-superuser-area]')) {
            superuserArea.classList.remove('co7e-show');
        }
    }
};

co7e.memberArea = show => {
    if (show) {
        for (let memberArea of document.querySelectorAll('[data-co7e-member-area]')) {
            memberArea.classList.add('co7e-show');
        }
    } else {
        for (let memberArea of document.querySelectorAll('[data-co7e-member-area]')) {
            memberArea.classList.remove('co7e-show');
        }
    }
};

co7e.submit = e => {
    if (e.target instanceof HTMLButtonElement || (e.target instanceof HTMLInputElement && e.key==='Enter')) {
        e.preventDefault();
        e.stopImmediatePropagation();
        return true;
    }
};

window.addEventListener('load', () => {
    // UPLOAD FORMS
    for (let uploader of document.querySelectorAll('[data-co7e-uploader]')) {
        uploader.innerHTML = `
        
        <progress max="100" value="0"></progress>
                        
        <input type="file" name="attachments[]" multiple>
                        
        <div data-co7e-drop-zone><i class="fas fa-file-upload fa-7x"></i></div>`;
        
        let dropzone = uploader.querySelector('[data-co7e-drop-zone]');
        
        dropzone.ondragenter = e => {
            e.stopPropagation();
            e.preventDefault();
        };
        
        dropzone.ondragover = e => {
            e.stopPropagation();
            e.preventDefault();
        };
        
        dropzone.ondrop = e => {
            e.stopPropagation();
            e.preventDefault();
            uploader.querySelector('[name="attachments[]"]').files = e.dataTransfer.files;
        };
    }
    
    // CONTAINERS
    for (let container of document.querySelectorAll('.co7e-container')) {
        let toggleButton = document.createElement('i');
        toggleButton.classList.add('fas', 'fa-bars');
        toggleButton.setAttribute('data-co7e-container-toggle', '');
        
        toggleButton.onclick = e => {
            container.classList.toggle('co7e-collapsed');
        };
        
        if (container.childElementCount < 3) {
            container.insertBefore(document.createElement('div'), container.firstElementChild);
        }
        
        container.firstElementChild.appendChild(toggleButton);
    }
});