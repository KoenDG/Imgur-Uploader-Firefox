'use strict';

$(document).foundation();

const Uploader = require('./../imgur.js');
const Stor = require('./../storage.js');

// fill in default value
const uploader = new Uploader();
const storage = new Stor();

let currentPage = (window.location.hash || '#1').slice(1);

let status = 0; // 0 local   1 account
const pageSegment = 15;

let login = false;

browser.storage.local.get('firefox-uploader-client-id').then((result) => {
    if (typeof result['firefox-uploader-client-id'] !== 'undefined') {
        document.querySelector('#client-id').value = result['firefox-uploader-client-id'];
    }
});

browser.storage.local.get('firefox-uploader-auth').then((value) => {
    console.log(value);
    const token = value['firefox-uploader-auth'].access_token;
    if (token) {
        login = true;
    } else {
        console.log('out');
        $('#account-image').css({ color: 'grey', cursor: 'default' });
    }
});

function hasClass(elem, className) {
    return elem.className.split(' ').indexOf(className) > -1;
}

function loadLocal() {
    document.getElementById('image-list').innerHTML = '';
    document.getElementById('image-page').innerHTML = '';

    browser.storage.local.get('firefox-uploader-imgur').then((value) => {
        console.log(value);
        const image = value['firefox-uploader-imgur'].reverse();
        const page = Math.ceil(image.length / pageSegment);
        if (page > 0) {
            if (page > 7) {
                const start = currentPage <= 4 ? 1 : ((currentPage + 3) > page ? page - 6 : currentPage - 3);
                const end = start + 6;
                for (let i = start; i <= end; i += 1) {
                    $(document.getElementById('image-page')).append(`<li><a class="page-href"  attr-page="${i}"  aria-label="Page ${i}">${i}</a></li>`);
                }
            } else {
                for (let i = 1; i <= page; i += 1) {
                    $(document.getElementById('image-page')).append(`<li><a class="page-href"  attr-page="${i}"  aria-label="Page ${i}">${i}</a></li>`);
                }
            }
            $(document.querySelector(`[aria-label='Page ${currentPage}']`)).parent().addClass('current');
            for (const x of value['firefox-uploader-imgur'].slice((currentPage - 1) * pageSegment, currentPage * pageSegment)) {
                console.log(x);
                if (x === undefined || x.link === undefined) {
                    continue;
                }
                $(document.getElementById('image-list')).append(`\
                    <div class="cell">\
                      <div class="card">\
                        <img src="${x.link}">\
                        <div class="card-section">\
                            <h6>${x.link}</h6>\
                            <button type="button" class="alert button delete float-right" data-id="${x.id}" data-delete="${x.deletehash}">Delete From Imgur</button>\
                        </div>\
                      </div>\
                    </div>\
                `);
            }
        }
    });
}
function loadAccount() {
    document.getElementById('image-list').innerHTML = '';
    document.getElementById('image-page').innerHTML = '';
    browser.storage.local.get('firefox-uploader-auth').then((value) => {
        console.log(value);
        const token = value['firefox-uploader-auth'].access_token;
        console.log(token);
        $.ajax({
            url: 'https://api.imgur.com/3/account/me/images',
            headers: { Authorization: `Bearer ${token}` },

        }).done((data) => {
            const image = data.data;
            const page = Math.ceil(image.length / pageSegment);
            if (page > 0) {
                console.log('test');

                if (page > 7) {
                    const start = currentPage <= 4 ? 1 : ((currentPage + 3) > page ? page - 6 : currentPage - 3);
                    const end = start + 6;
                    for (let i = start; i <= end; i += 1) {
                        $(document.getElementById('image-page')).append(`<li><a class="page-href"  attr-page="${i}" aria-label="Page ${i}">${i}</a></li>`);
                    }
                } else {
                    for (let i = 1; i <= page; i += 1) {
                        $(document.getElementById('image-page')).append(`<li><a class="page-href" attr-page="${i}" aria-label="Page ${i}">${i}</a></li>`);
                    }
                }
                $(document.querySelector(`[aria-label='Page ${currentPage}']`)).parent().addClass('current');
                // $(document.querySelector("a.page-href"))

                for (const x of image.slice((currentPage - 1) * pageSegment, currentPage * pageSegment)) {
                    console.log(x);
                    if (x === undefined || x.link === undefined) {
                        continue;
                    }
                    $(document.getElementById('image-list')).append(`\
                        <div class="cell">\
                          <div class="card">\
                            <img src="${x.link}">\
                            <div class="card-section">\
                                <h6>${x.link}</h6>\
                                <button type="button" class="alert button delete float-right" data-id="${x.id}" data-delete="${x.deletehash}">Delete From Imgur</button>\
                            </div>\
                          </div>\
                        </div>\
                    `);
                }
            }
        });
    });
}

loadLocal();

document.getElementById('local-image').addEventListener('click', () => {
    currentPage = 1;
    status = 0;
    loadLocal();
});

document.getElementById('account-image').addEventListener('click', () => {
    if (login === true) {
        currentPage = 1;
        status = 1;
        loadAccount();
    }
});

document.addEventListener('click', (e) => {
    if (hasClass(e.target, 'delete')) {
        uploader.remove(e.target.getAttribute('data-delete')).then((msg) => {
            if (msg.success) {
                storage.remove(e.target.getAttribute('data-id'));
                e.target.parentNode.parentNode.parentNode.style.display = 'none';
            }
        });
    } else if (hasClass(e.target, 'page-href')) {
        currentPage = parseInt(e.target.getAttribute('attr-page'), 10);
        console.log(status);
        console.log(currentPage);
        if (status === 0) {
            loadLocal();
        } else {
            loadAccount();
        }
        console.log(e.target);
        // location.hash = e.target.hash;
        // location.reload();
    }
}, false);
