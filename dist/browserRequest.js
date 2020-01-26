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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJvd3NlclJlcXVlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvYnJvd3NlclJlcXVlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFDQSxvREFBdUI7QUFFUixLQUFLLFVBQVUsY0FBYyxDQUFDLElBQVUsRUFBRSxTQUFjLEVBQUU7SUFDdkUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUU7UUFDZixNQUFNLHNDQUFzQyxDQUFDO0tBQzlDO0lBRUQsSUFBSSxVQUFVLEdBQVE7UUFDcEIsV0FBVyxFQUFFLFNBQVM7UUFDdEIsT0FBTyxFQUFFLEVBQUU7UUFDWCxJQUFJLEVBQUUsSUFBSTtRQUNWLFFBQVEsRUFBRSxRQUFRO1FBQ2xCLElBQUksRUFBRSxNQUFNO0tBQ2IsQ0FBQztJQUVGLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFO1FBQ2xCLFVBQVUsQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO0tBQzNCO0lBRUQsSUFBSSxXQUFXLEdBQUcsZ0JBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLFVBQVUsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUVsRCxJQUFJLFNBQVMsR0FBRyxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFDLFdBQVcsRUFBQyxFQUFFO1FBQ3RELE9BQU8sQ0FBQyxHQUFHLENBQ1QsaUZBQWlGLENBQ2xGLENBQUM7UUFDRixPQUFPLENBQUMsR0FBRyxDQUFDLHdCQUF3QixFQUFFLFdBQVcsQ0FBQyxHQUFHLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFFcEUsSUFBSSxHQUFHLEdBQUcsTUFBTSxLQUFLLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUNwRCxJQUFJLEtBQUssR0FBRyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDdkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNuQixPQUFPLENBQUMsR0FBRyxDQUNULCtFQUErRSxDQUNoRixDQUFDO1FBQ0YsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFDaEIsT0FBTyxTQUFTLENBQUM7QUFDbkIsQ0FBQztBQWxDRCxpQ0FrQ0M7QUFFTSxLQUFLLFVBQVUsa0JBQWtCLENBQUMsQ0FBTyxFQUFFLENBQU07SUFDdEQsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUU7UUFDZCxDQUFDLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztLQUNoQjtJQUVELENBQUMsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLEdBQUcsZ0NBQWdDLENBQUM7SUFFN0QsT0FBTyxjQUFjLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzlCLENBQUM7QUFSRCxnREFRQyJ9