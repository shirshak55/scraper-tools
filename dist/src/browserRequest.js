"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
async function browserRequest(page, config = {}) {
    if (!config.url) {
        throw "URL is not given. Please provide Url";
    }
    let defaultCfg = {
        credentials: "include",
        headers: {},
        body: null,
        redirect: "follow",
        mode: "cors"
    };
    if (!config.method) {
        defaultCfg.method = "GET";
    }
    let fetchConfig = lodash_1.default.merge({}, defaultCfg, config);
    let evaluated = await page.evaluate(async (fetchConfig) => {
        console.log("start--------------------------------------------------------------------------");
        console.log("Sending Request to url", fetchConfig.url, fetchConfig);
        let res = await fetch(fetchConfig.url, fetchConfig);
        let toRet = res.text();
        console.log(toRet);
        console.log("end--------------------------------------------------------------------------");
        return toRet;
    }, fetchConfig);
    return evaluated;
}
exports.default = browserRequest;
async function jsonBrowserRequest(a, b) {
    if (!b.headers) {
        b.headers = {};
    }
    b.headers["content-type"] = "application/json;charset=UTF-8";
    return browserRequest(a, b);
}
exports.jsonBrowserRequest = jsonBrowserRequest;
//# sourceMappingURL=browserRequest.js.map