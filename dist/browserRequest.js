"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
        mode: "cors"
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJvd3NlclJlcXVlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvYnJvd3NlclJlcXVlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFDQSxvREFBc0I7QUFDdEIsNERBQWtDO0FBRWxDLElBQUksSUFBSSxHQUFHLElBQUksb0JBQVMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFBO0FBRXZDLEtBQUssVUFBVSxjQUFjLENBQUMsSUFBVSxFQUFFLFNBQWMsRUFBRTtJQUMvRCxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRTtRQUNmLE1BQU0sc0NBQXNDLENBQUE7S0FDN0M7SUFFRCxJQUFJLFVBQVUsR0FBUTtRQUNwQixXQUFXLEVBQUUsU0FBUztRQUN0QixPQUFPLEVBQUUsRUFBRTtRQUNYLElBQUksRUFBRSxJQUFJO1FBQ1YsUUFBUSxFQUFFLFFBQVE7UUFDbEIsSUFBSSxFQUFFLE1BQU07S0FDYixDQUFBO0lBRUQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUU7UUFDbEIsVUFBVSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUE7S0FDMUI7SUFFRCxJQUFJLFdBQVcsR0FBRyxnQkFBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsVUFBVSxFQUFFLE1BQU0sQ0FBQyxDQUFBO0lBRWpELElBQUksU0FBUyxHQUFHLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsV0FBVyxFQUFFLEVBQUU7UUFDeEQsSUFBSSxHQUFHLEdBQUcsTUFBTSxLQUFLLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRSxXQUFXLENBQUMsQ0FBQTtRQUNuRCxJQUFJLEtBQUssR0FBRyxNQUFNLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtRQUM1QixPQUFPLEtBQUssQ0FBQTtJQUNkLENBQUMsRUFBRSxXQUFXLENBQUMsQ0FBQTtJQUNmLE9BQU8sU0FBUyxDQUFBO0FBQ2xCLENBQUM7QUF6QkQsd0NBeUJDO0FBRU0sS0FBSyxVQUFVLG9CQUFvQixDQUFDLElBQVUsRUFBRSxTQUFjLEVBQUU7SUFDckUsT0FBTyxNQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsc0JBQXNCLEVBQUUsS0FBSyxVQUFVLHdCQUF3QjtRQUN2RixPQUFPLE1BQU0sY0FBYyxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQTtJQUMzQyxDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUM7QUFKRCxvREFJQztBQUVELElBQUksbUJBQW1CLEdBQUcsQ0FBQyxDQUFBO0FBQ3BCLEtBQUssVUFBVSx3QkFBd0IsQ0FBQyxJQUFVLEVBQUUsV0FBbUIsRUFBRSxTQUFjLEVBQUU7SUFDOUYsbUJBQW1CLEdBQUcsQ0FBQyxtQkFBbUIsR0FBRyxDQUFDLENBQUMsR0FBRyxXQUFXLENBQUE7SUFFN0QsT0FBTyxNQUFNLElBQUksQ0FBQyxPQUFPLENBQ3ZCLHNCQUFzQixHQUFHLG1CQUFtQixFQUM1QyxLQUFLLFVBQVUsd0JBQXdCO1FBQ3JDLE9BQU8sTUFBTSxjQUFjLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFBO0lBQzNDLENBQUMsQ0FDRixDQUFBO0FBQ0gsQ0FBQztBQVRELDREQVNDO0FBRU0sS0FBSyxVQUFVLGtCQUFrQixDQUFDLENBQU8sRUFBRSxDQUFNO0lBQ3RELElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFO1FBQ2QsQ0FBQyxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUE7S0FDZjtJQUVELENBQUMsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLEdBQUcsZ0NBQWdDLENBQUE7SUFFNUQsT0FBTyxjQUFjLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBO0FBQzdCLENBQUM7QUFSRCxnREFRQyJ9