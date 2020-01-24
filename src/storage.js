module.exports = class Storage {
    constructor() {
        browser.storage.local.get('firefox-uploader-imgur').then((obj) => {
            if (Object.getOwnPropertyNames(obj).length === 0) {
                console.log('test');
                browser.storage.local.set({
                    'firefox-uploader-imgur': [],
                });
            }
        });
    }

    add(image) {
        // eslint-disable-next-line no-unused-vars
        return new Promise((resolve, reject) => {
            browser.storage.local.get('firefox-uploader-imgur').then((obj) => {
                const send = obj['firefox-uploader-imgur'];

                image.viewable = true;

                send.push(image);
                console.log(send);
                browser.storage.local.set({
                    'firefox-uploader-imgur': send,
                }).then(() => {
                    resolve('test');
                });
            });
        });
    }

    remove(imageId) {
        browser.storage.local.get('firefox-uploader-imgur').then((obj) => {
            const send = [];
            const items = obj['firefox-uploader-imgur'];
            Object.keys(items).forEach((x) => {
                // eslint-disable-next-line eqeqeq
                if (items[x].id != imageId) {
                    send.push(items[x]);
                }
            });

            browser.storage.local.set({
                'firefox-uploader-imgur': send,
            });
        });
    }

    change(imageId, status) {
        let imgId = imageId;
        if (!(imageId instanceof Array)) {
            imgId = [imageId];
        }

        browser.storage.local.get('firefox-uploader-imgur').then((obj) => {
            const send = [];
            const items = obj['firefox-uploader-imgur'];
            Object.keys(items).forEach((x) => {
                if (imgId.indexOf(items[x].id) >= 0) {
                    console.log(imgId);
                    console.log(status);

                    Object.keys(status).forEach((prop) => {
                        const property = status[prop];
                        if (Object.prototype.hasOwnProperty.call(status, property)) {
                            items[x][property] = status[property];
                        }
                    });
                    console.log(items[x]);
                    send.push(items[x]);
                } else {
                    send.push(items[x]);
                }
            });

            browser.storage.local.set({
                'firefox-uploader-imgur': send,
            });
        });
    }

    removeAll() {
        browser.storage.local.set({
            'firefox-uploader-imgur': [],
        });
    }
};
