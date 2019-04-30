"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_promise_1 = __importDefault(require("request-promise"));
const p_retry_1 = __importDefault(require("p-retry"));
const consoleMessage_1 = require("./consoleMessage");
let proxy = [];
let currentIndex = 0;
let cookie = '';
let retries = 5;
let timeout = 5 * 1000;
exports.setProxy = (pxy) => {
    consoleMessage_1.success(`Request::: Setting Proxies to`, pxy);
    currentIndex = 0;
    proxy = pxy;
};
exports.setCookie = (c) => {
    consoleMessage_1.success(`Request::: Setting Cookie to ${c}`);
    cookie = c;
};
exports.setRetries = (t) => {
    consoleMessage_1.success(`Request::: Setting retries to ${t}`);
    retries = parseInt(t, 10);
};
exports.setTout = (t) => {
    consoleMessage_1.success(`Request::: Setting Timeout to ${t}`);
    timeout = parseInt(t, 10) * 1000;
};
exports.default = async (url, isMobile = false) => {
    let agent;
    if (isMobile) {
        agent = `Mozilla/5.0 (Linux; Android 7.0; SM-G930V Build/NRD90M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.125 Mobile Safari/537.36`;
    }
    else {
        agent = `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36`;
    }
    let pxy = '';
    if (proxy.length === 0) {
        pxy = null;
    }
    else {
        pxy = proxy[currentIndex++ % proxy.length];
    }
    const run = async () => {
        return await request_promise_1.default({
            debug: true,
            proxy: pxy,
            jar: true,
            strictSSL: false,
            uri: url,
            encoding: null,
            gzip: true,
            headers: {
                cookie,
                'user-agent': agent,
                'content-type': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                'accept-language': 'en-US,en;q=0.9',
            },
            timeout,
        });
    };
    try {
        return await p_retry_1.default(run, {
            retries,
            onFailedAttempt: (error) => {
                console.log(`Attempt ${error.attemptNumber} failed. There are ${error.retriesLeft} attempts left. Proxy: ${pxy} Url: ${error.options.uri} Error Message: ${error.message} `);
            },
        });
    }
    catch (e) {
        consoleMessage_1.error(e);
    }
};
//# sourceMappingURL=request.js.map