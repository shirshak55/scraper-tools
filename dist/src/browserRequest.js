"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function browserRequest(page, config = {}) {
    if (!config.method) {
        config.method = 'GET';
    }
    if (!config.url) {
        throw 'URL is not given. Please provide Url';
    }
    let evaluated = await page.evaluate(async (url, method) => {
        console.log('start--------------------------------------------------------------------------');
        console.log('Sending Request to url', url, method);
        let res = await fetch(config.url, {
            credentials: 'include',
            headers: {
                accept: '*/*',
                'accept-language': 'en-US,en;q=0.9'
            },
            body: null,
            method: config.method,
            redirect: 'follow',
            mode: 'cors',
            ...config
        });
        let toRet = res.text();
        console.log(toRet);
        console.log('end--------------------------------------------------------------------------');
        return toRet;
    }, config);
    return evaluated;
}
exports.default = browserRequest;
//# sourceMappingURL=browserRequest.js.map