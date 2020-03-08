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
        let toRet = await res.text();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJvd3NlclJlcXVlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvYnJvd3NlclJlcXVlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFDQSxvREFBc0I7QUFFUCxLQUFLLFVBQVUsY0FBYyxDQUFDLElBQVUsRUFBRSxTQUFjLEVBQUU7SUFDdkUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUU7UUFDZixNQUFNLHNDQUFzQyxDQUFBO0tBQzdDO0lBRUQsSUFBSSxVQUFVLEdBQVE7UUFDcEIsV0FBVyxFQUFFLFNBQVM7UUFDdEIsT0FBTyxFQUFFLEVBQUU7UUFDWCxJQUFJLEVBQUUsSUFBSTtRQUNWLFFBQVEsRUFBRSxRQUFRO1FBQ2xCLElBQUksRUFBRSxNQUFNO0tBQ2IsQ0FBQTtJQUVELElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFO1FBQ2xCLFVBQVUsQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFBO0tBQzFCO0lBRUQsSUFBSSxXQUFXLEdBQUcsZ0JBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLFVBQVUsRUFBRSxNQUFNLENBQUMsQ0FBQTtJQUVqRCxJQUFJLFNBQVMsR0FBRyxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLFdBQVcsRUFBRSxFQUFFO1FBQ3hELE9BQU8sQ0FBQyxHQUFHLENBQUMsaUZBQWlGLENBQUMsQ0FBQTtRQUM5RixPQUFPLENBQUMsR0FBRyxDQUFDLHdCQUF3QixFQUFFLFdBQVcsQ0FBQyxHQUFHLEVBQUUsV0FBVyxDQUFDLENBQUE7UUFDbkUsSUFBSSxHQUFHLEdBQUcsTUFBTSxLQUFLLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRSxXQUFXLENBQUMsQ0FBQTtRQUNuRCxJQUFJLEtBQUssR0FBRyxNQUFNLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtRQUM1QixPQUFPLENBQUMsR0FBRyxDQUFDLCtFQUErRSxDQUFDLENBQUE7UUFDNUYsT0FBTyxLQUFLLENBQUE7SUFDZCxDQUFDLEVBQUUsV0FBVyxDQUFDLENBQUE7SUFDZixPQUFPLFNBQVMsQ0FBQTtBQUNsQixDQUFDO0FBNUJELGlDQTRCQztBQUVNLEtBQUssVUFBVSxrQkFBa0IsQ0FBQyxDQUFPLEVBQUUsQ0FBTTtJQUN0RCxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRTtRQUNkLENBQUMsQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFBO0tBQ2Y7SUFFRCxDQUFDLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxHQUFHLGdDQUFnQyxDQUFBO0lBRTVELE9BQU8sY0FBYyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTtBQUM3QixDQUFDO0FBUkQsZ0RBUUMifQ==