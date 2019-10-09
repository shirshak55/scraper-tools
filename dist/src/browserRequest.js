"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function browserRequest(page, url, method = 'GET') {
    let evaluated = await page.evaluate(async (url, method) => {
        console.log('start--------------------------------------------------------------------------');
        console.log('Sending Request to url', url, method);
        let res = await fetch(url, {
            credentials: 'include',
            headers: {
                accept: '*/*',
                'accept-language': 'en-US,en;q=0.9'
            },
            body: null,
            method,
            redirect: 'follow',
            mode: 'cors'
        });
        let toRet = res.text();
        console.log(toRet);
        console.log('end--------------------------------------------------------------------------');
        return toRet;
    }, url, method);
    return evaluated;
}
exports.default = browserRequest;
//# sourceMappingURL=browserRequest.js.map