const copy = require('./copy.js');
const Storage = require('./storage.js');

const storage = new Storage();

function actionAbleItem(x) {
    return !(x === undefined || x.link === undefined || x.viewable === false);
}

function hasClass(elem, className) {
    return elem.className.split(' ').indexOf(className) > -1;
}

browser.storage.local.get('firefox-uploader-imgur').then((value) => {
    console.log(value);

    const items = value['firefox-uploader-imgur'].reverse();

    Object.keys(items).forEach((x) => {
        // This does not seem like an efficient way to get key/value.
        console.log(items[x]);
        if (actionAbleItem(items[x])) {
            $(document.getElementById('image-list')).append(`<div class="callout small image-url" data-closable data-url="'${items[x].link}'">\n
            <p><img src="https://i.imgur.com/'${items[x].id}'.jpg" class="preview"> <span class="link">'${items[x].link}'</span><button class="copy-clipboard" id="'${items[x].link}'-copy">Copy</button></p>\n
            <button class="close-button" aria-label="Dismiss alert" type="button" id="'${items[x].id}'-close" data-close>\n
            <span aria-hidden="true" class="close-button-bubble">&times;</span>\n
            </button>\n
        </div>`);
        }
    });
});

browser.storage.local.get('firefox-uploader-auto-copy').then((value) => {
    document.getElementById('clipboard-switch').checked = value['firefox-uploader-auto-copy'];
});


document.addEventListener('click', (e) => {
    if (hasClass(e.target, 'close-button')) {
        console.log(e.target.id);
        storage.change(e.target.id.split('-close')[0], { 'viewable': false });
        // storage.remove(e.target.id.split('-close')[0]);
    }
    if (hasClass(e.target, 'close-button-bubble')) {
        console.log(e.target.id);
        storage.change(e.target.parentNode.id.split('-close')[0], { 'viewable': false });
    }
    if (hasClass(e.target, 'copy-clipboard')) {
        // const link = 'https://i.imgur.com/'+e.target.id.split('-copy')[0]+'.jpg';
        const link = e.target.id.split('-copy')[0];
        copy.setCopy(link);
    }
    if (hasClass(e.target, 'clear-all')) {
        // storage.removeAll();

        const link = document.querySelectorAll('.image-url');
        const manipulateList = [];
        for (let i = 0; i < link.length; i += 1) {
            console.log(link[i].querySelector('.close-button').id);
            manipulateList.push(link[i].querySelector('.close-button').id.split('-close')[0]);
            link[i].parentNode.removeChild(link[i]);
        }
        storage.change(manipulateList, { 'viewable': false });
    }
}, false);

document.getElementById('clipboard-switch').addEventListener('change', (e) => {
    console.log(e.target.checked);
    browser.storage.local.set({ 'firefox-uploader-auto-copy': e.target.checked });
});

document.addEventListener('mouseover', (e) => {
    if (hasClass(e.target, 'preview')) {
        console.log(e.pageX);
        console.log(e.pageY);
        console.log(e.target.attributes);
        const viewer = $(document.querySelector('div.viewer'));
        viewer.show().css({
            left: '100px',
            top: e.pageY - 30,
        });

        viewer.children('img').attr('src', e.target.getAttribute('src'));
    }
}, false);

document.addEventListener('mouseout', (e) => {
    if (hasClass(e.target, 'preview')) {
        $(document.querySelector('div.viewer')).hide();
    }
}, false);

document.querySelector('#add-image').addEventListener('click', () => {
    const createData = {
        type: 'detached_panel',
        titlePreface: 'Upload Image',
        url: '../templates/panel.html',
        width: 400,
        height: 200,
        left: 100,
        allowScriptsToClose: true,
    };

    const creating = browser.windows.create(createData);
    console.log('test');
    console.log(creating);
});

document.querySelector('#options').addEventListener('click', () => {
    browser.tabs.create({
        url: 'settings/options.html',
    });
});
