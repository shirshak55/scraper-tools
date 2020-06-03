"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonBrowserRequest = exports.concurrentBrowserRequest = exports.singleBrowserRequest = exports.browserRequest = void 0;
const lodash_1 = __importDefault(require("lodash"));
const async_lock_1 = __importDefault(require("async-lock"));
let lock = new async_lock_1.default({ maxPending: 5000 });
async function browserRequest(page, config = {}) {
    if (!config.url) {
        throw "URL is not given. Please provide Url";
    }
    let defaultCfg = {
        credentials: "include",
        headers: {},
        body: null,
        redirect: "follow",
        mode: "cors",
    };
    if (!config.method) {
        defaultCfg.method = "GET";
    }
    let fetchConfig = lodash_1.default.merge({}, defaultCfg, config);
    let evaluated = await page.evaluate(async (fetchConfig) => {
        let res = await fetch(fetchConfig.url, fetchConfig);
        let toRet = await res.text();
        return toRet;
    }, fetchConfig);
    return evaluated;
}
exports.browserRequest = browserRequest;
async function singleBrowserRequest(page, config = {}) {
    return await lock.acquire("singleBrowserRequest", async function singleBrowserRequestLock() {
        return await browserRequest(page, config);
    });
}
exports.singleBrowserRequest = singleBrowserRequest;
let concurrentRequestId = 0;
async function concurrentBrowserRequest(page, concurrency, config = {}) {
    concurrentRequestId = (concurrentRequestId + 1) % concurrency;
    return await lock.acquire("singleBrowserRequest" + concurrentRequestId, async function singleBrowserRequestLock() {
        return await browserRequest(page, config);
    });
}
exports.concurrentBrowserRequest = concurrentBrowserRequest;
async function jsonBrowserRequest(a, b) {
    if (!b.headers) {
        b.headers = {};
    }
    b.headers["content-type"] = "application/json;charset=UTF-8";
    return browserRequest(a, b);
}
exports.jsonBrowserRequest = jsonBrowserRequest;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJvd3NlclJlcXVlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvYnJvd3NlclJlcXVlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0Esb0RBQXNCO0FBQ3RCLDREQUFrQztBQUVsQyxJQUFJLElBQUksR0FBRyxJQUFJLG9CQUFTLENBQUMsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQTtBQUV2QyxLQUFLLFVBQVUsY0FBYyxDQUFDLElBQVUsRUFBRSxTQUFjLEVBQUU7SUFDL0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUU7UUFDZixNQUFNLHNDQUFzQyxDQUFBO0tBQzdDO0lBRUQsSUFBSSxVQUFVLEdBQVE7UUFDcEIsV0FBVyxFQUFFLFNBQVM7UUFDdEIsT0FBTyxFQUFFLEVBQUU7UUFDWCxJQUFJLEVBQUUsSUFBSTtRQUNWLFFBQVEsRUFBRSxRQUFRO1FBQ2xCLElBQUksRUFBRSxNQUFNO0tBQ2IsQ0FBQTtJQUVELElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFO1FBQ2xCLFVBQVUsQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFBO0tBQzFCO0lBRUQsSUFBSSxXQUFXLEdBQUcsZ0JBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLFVBQVUsRUFBRSxNQUFNLENBQUMsQ0FBQTtJQUVqRCxJQUFJLFNBQVMsR0FBRyxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLFdBQVcsRUFBRSxFQUFFO1FBQ3hELElBQUksR0FBRyxHQUFHLE1BQU0sS0FBSyxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsV0FBVyxDQUFDLENBQUE7UUFDbkQsSUFBSSxLQUFLLEdBQUcsTUFBTSxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUE7UUFDNUIsT0FBTyxLQUFLLENBQUE7SUFDZCxDQUFDLEVBQUUsV0FBVyxDQUFDLENBQUE7SUFDZixPQUFPLFNBQVMsQ0FBQTtBQUNsQixDQUFDO0FBekJELHdDQXlCQztBQUVNLEtBQUssVUFBVSxvQkFBb0IsQ0FBQyxJQUFVLEVBQUUsU0FBYyxFQUFFO0lBQ3JFLE9BQU8sTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLHNCQUFzQixFQUFFLEtBQUssVUFBVSx3QkFBd0I7UUFDdkYsT0FBTyxNQUFNLGNBQWMsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUE7SUFDM0MsQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDO0FBSkQsb0RBSUM7QUFFRCxJQUFJLG1CQUFtQixHQUFHLENBQUMsQ0FBQTtBQUNwQixLQUFLLFVBQVUsd0JBQXdCLENBQUMsSUFBVSxFQUFFLFdBQW1CLEVBQUUsU0FBYyxFQUFFO0lBQzlGLG1CQUFtQixHQUFHLENBQUMsbUJBQW1CLEdBQUcsQ0FBQyxDQUFDLEdBQUcsV0FBVyxDQUFBO0lBRTdELE9BQU8sTUFBTSxJQUFJLENBQUMsT0FBTyxDQUN2QixzQkFBc0IsR0FBRyxtQkFBbUIsRUFDNUMsS0FBSyxVQUFVLHdCQUF3QjtRQUNyQyxPQUFPLE1BQU0sY0FBYyxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQTtJQUMzQyxDQUFDLENBQ0YsQ0FBQTtBQUNILENBQUM7QUFURCw0REFTQztBQUVNLEtBQUssVUFBVSxrQkFBa0IsQ0FBQyxDQUFPLEVBQUUsQ0FBTTtJQUN0RCxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRTtRQUNkLENBQUMsQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFBO0tBQ2Y7SUFFRCxDQUFDLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxHQUFHLGdDQUFnQyxDQUFBO0lBRTVELE9BQU8sY0FBYyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTtBQUM3QixDQUFDO0FBUkQsZ0RBUUMifQ==