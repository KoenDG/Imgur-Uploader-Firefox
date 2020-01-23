const href = location.href;

if (href.indexOf('state=FirefoxAddonAuth') > -1) {
    const infoStr = href.split('state=FirefoxAddonAuth#')[1].split('&');
    const info = { 'task': 'auth' };
    infoStr.forEach((item) => {
        const [key, value] = item.split('=');
        info[key] = value;
    });
    console.log(info);
    browser.runtime.sendMessage(info).then(() => {
        console.log('success');
    }, () => {
        console.log('failed');
    });
}
