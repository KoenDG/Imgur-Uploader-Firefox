const request = require('browser-request');

module.exports = class Uploader {
    constructor() {
        browser.storage.local.get('firefox-uploader-client-id').then((result) => {
            const backupList = ['a6bebdd6a51f656', 'f752792c52f4cdf', '474d8a50e7e752d', '9089d7837e30269', '6c6fa522da181b8', 'bbf63f907ae5614', '480391db79e87b6', 'ea76f402e22007a'];
            if (typeof result['firefox-uploader-client-id'] !== 'undefined') {
                this.clientID = result['firefox-uploader-client-id'];
                console.log(result['firefox-uploader-client-id']);
            } else {
                this.clientID = backupList[Math.floor(Math.random() * backupList.length)];
            }
            console.log(this.clientID);
        });
    }

    update() {
        browser.storage.local.get('firefox-uploader-client-id').then((result) => {
            const backupList = ['a6bebdd6a51f656', 'f752792c52f4cdf', '474d8a50e7e752d', '9089d7837e30269', '6c6fa522da181b8', 'bbf63f907ae5614', '480391db79e87b6', 'ea76f402e22007a'];
            if (typeof result['firefox-uploader-client-id'] !== 'undefined') {
                this.clientID = result['firefox-uploader-client-id'];
                console.log(result['firefox-uploader-client-id']);
            } else {
                this.clientID = backupList[Math.floor(Math.random() * backupList.length)];
            }
            console.log(this.clientID);
        });
    }

    uuid() {
        let d = Date.now();
        if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
            d += performance.now(); // use high-precision timer if available
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            // eslint-disable-next-line no-bitwise
            const r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            // eslint-disable-next-line no-bitwise,no-mixed-operators
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }

    imageReader(image) {
        const reader = new FileReader();
        return new Promise((resolve, reject) => {
            reader.onload = (event) => {
                resolve(event.target.result.split('base64,')[1]);
            };

            reader.onerror = () => reject(new Error(this));

            reader.readAsDataURL(image);
        });
    }

    uploadToImgur(file) {
        const that = this;
        return new Promise((resolve, reject) => {
            console.log(this);
            console.log(that.uuid());
            const options = {
                url: 'https://api.imgur.com/3/image',
                headers: {
                    authorization: `Client-ID ${that.clientID}`,
                },
                json: {
                    image: file,
                },

            };
            console.log(options);
            request.post(options, (error, res, body) => {
                console.log(body.data);
                if (body.data.error) {
                    reject(body.data);
                } else {
                    resolve(body.data);
                }
            });
        });
    }

    uploader(image) {
        return this.imageReader(image).then(this.uploadToImgur.bind(this));
    }

    remove(deletehash) {
        const that = this;
        return new Promise((resolve, reject) => {
            const options = {
                method: 'delete',
                url: `https://api.imgur.com/3/image/${deletehash}`,
                headers: {
                    authorization: `Client-ID ${that.clientID}`,
                },
            };

            console.log(options);
            request(options, (error, res, body) => {
                const result = JSON.parse(body);
                if (!result.data) {
                    reject(result);
                } else {
                    resolve(result);
                }
            });
        });
    }
};
