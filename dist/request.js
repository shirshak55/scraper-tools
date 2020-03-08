"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_promise_1 = __importDefault(require("request-promise"));
const p_retry_1 = __importDefault(require("p-retry"));
const debug_1 = __importDefault(require("debug"));
let error = debug_1.default("scrapper_tools:request:error");
let warning = debug_1.default("scrapper_tools:request:warning");
let success = debug_1.default("scrapper_tools:request:success");
exports.request = (() => {
    let proxies = [];
    let currentIndex = 0;
    let retries = 5;
    let timeout = 5 * 1000;
    let userAgent = null;
    return {
        setProxy: (pxy) => {
            success("Request Module", `Setting Proxies to`, pxy);
            currentIndex = 0;
            proxies = pxy;
        },
        setRetries: (t) => {
            success("Request Module", `Setting retries to ${t}`);
            retries = parseInt(t, 10);
        },
        setTimeout: (t) => {
            success("Request Module", `Setting Timeout to ${t}`);
            timeout = parseInt(t, 10) * 1000;
        },
        setUserAgent: (value = `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36`) => {
            userAgent = value;
        },
        make: async (url, passHeaders = {}, others = {}) => {
            let pxy = "";
            if (proxies.length === 0) {
                pxy = null;
            }
            else {
                pxy = proxies[currentIndex++ % proxies.length];
            }
            const run = async (url, passHeaders = {}, others = {}) => {
                try {
                    let response = await request_promise_1.default({
                        proxy: pxy,
                        jar: true,
                        strictSSL: false,
                        uri: url,
                        encoding: null,
                        gzip: true,
                        headers: {
                            "user-agent": userAgent,
                            "content-type": "application/json",
                            "accept-language": "en-US,en;q=0.9",
                            ...passHeaders
                        },
                        timeout,
                        ...others
                    });
                    return response;
                }
                catch (e) {
                    if (e && e.statusCode && e.statusCode >= 400) {
                        throw new p_retry_1.default.AbortError(e);
                    }
                    throw e;
                }
            };
            try {
                return await p_retry_1.default(() => run(url, passHeaders, others), {
                    retries,
                    onFailedAttempt: (error) => {
                        var _a;
                        warning("Request Module", `Attempt ${error === null || error === void 0 ? void 0 : error.attemptNumber}.${error === null || error === void 0 ? void 0 : error.retriesLeft} attempts left Proxy: ${pxy} Url: ${(_a = error === null || error === void 0 ? void 0 : error.options) === null || _a === void 0 ? void 0 : _a.uri}. Status Code ${error.message.statusCode}`);
                    }
                });
            }
            catch (e) {
                error("Request Module unrecoverable error:::", e === null || e === void 0 ? void 0 : e.statusCode);
                throw e;
            }
        }
    };
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVxdWVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9yZXF1ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsc0VBQTRDO0FBQzVDLHNEQUE0QjtBQUM1QixrREFBeUI7QUFFekIsSUFBSSxLQUFLLEdBQUcsZUFBSyxDQUFDLDhCQUE4QixDQUFDLENBQUE7QUFDakQsSUFBSSxPQUFPLEdBQUcsZUFBSyxDQUFDLGdDQUFnQyxDQUFDLENBQUE7QUFDckQsSUFBSSxPQUFPLEdBQUcsZUFBSyxDQUFDLGdDQUFnQyxDQUFDLENBQUE7QUFFeEMsUUFBQSxPQUFPLEdBQUcsQ0FBQyxHQUFHLEVBQUU7SUFDM0IsSUFBSSxPQUFPLEdBQWtCLEVBQUUsQ0FBQTtJQUMvQixJQUFJLFlBQVksR0FBRyxDQUFDLENBQUE7SUFFcEIsSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFBO0lBQ2YsSUFBSSxPQUFPLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQTtJQUN0QixJQUFJLFNBQVMsR0FBa0IsSUFBSSxDQUFBO0lBRW5DLE9BQU87UUFDTCxRQUFRLEVBQUUsQ0FBQyxHQUFrQixFQUFFLEVBQUU7WUFDL0IsT0FBTyxDQUFDLGdCQUFnQixFQUFFLG9CQUFvQixFQUFFLEdBQUcsQ0FBQyxDQUFBO1lBQ3BELFlBQVksR0FBRyxDQUFDLENBQUE7WUFDaEIsT0FBTyxHQUFHLEdBQUcsQ0FBQTtRQUNmLENBQUM7UUFFRCxVQUFVLEVBQUUsQ0FBQyxDQUFTLEVBQUUsRUFBRTtZQUN4QixPQUFPLENBQUMsZ0JBQWdCLEVBQUUsc0JBQXNCLENBQUMsRUFBRSxDQUFDLENBQUE7WUFDcEQsT0FBTyxHQUFHLFFBQVEsQ0FBQyxDQUFRLEVBQUUsRUFBRSxDQUFDLENBQUE7UUFDbEMsQ0FBQztRQUVELFVBQVUsRUFBRSxDQUFDLENBQVMsRUFBRSxFQUFFO1lBQ3hCLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxzQkFBc0IsQ0FBQyxFQUFFLENBQUMsQ0FBQTtZ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