"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_promise_1 = __importDefault(require("request-promise"));
const p_retry_1 = __importDefault(require("p-retry"));
const request_1 = __importDefault(require("request"));
const debug_1 = __importDefault(require("debug"));
let error = debug_1.default("scrapper_tools:request:error");
let warning = debug_1.default("scrapper_tools:request:warning");
let success = debug_1.default("scrapper_tools:request:success");
exports.default = (() => {
    let proxies = [];
    let currentIndex = 0;
    let retries = 5;
    let timeout = 5 * 1000;
    let userAgent = null;
    return {
        getOriginalRequestPromise: () => {
            return request_promise_1.default;
        },
        getOriginalRequest: () => {
            return request_1.default;
        },
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVxdWVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9yZXF1ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsc0VBQTRDO0FBQzVDLHNEQUE0QjtBQUU1QixzREFBNkI7QUFDN0Isa0RBQXlCO0FBRXpCLElBQUksS0FBSyxHQUFHLGVBQUssQ0FBQyw4QkFBOEIsQ0FBQyxDQUFBO0FBQ2pELElBQUksT0FBTyxHQUFHLGVBQUssQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFBO0FBQ3JELElBQUksT0FBTyxHQUFHLGVBQUssQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFBO0FBRXJELGtCQUFlLENBQUMsR0FBRyxFQUFFO0lBQ25CLElBQUksT0FBTyxHQUFrQixFQUFFLENBQUE7SUFDL0IsSUFBSSxZQUFZLEdBQUcsQ0FBQyxDQUFBO0lBRXBCLElBQUksT0FBTyxHQUFHLENBQUMsQ0FBQTtJQUNmLElBQUksT0FBTyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUE7SUFDdEIsSUFBSSxTQUFTLEdBQWtCLElBQUksQ0FBQTtJQUVuQyxPQUFPO1FBQ0wseUJBQXlCLEVBQUUsR0FBRyxFQUFFO1lBQzlCLE9BQU8seUJBQWMsQ0FBQTtRQUN2QixDQUFDO1FBQ0Qsa0JBQWtCLEVBQUUsR0FBRyxFQUFFO1lBQ3ZCLE9BQU8saUJBQU8sQ0FBQTtRQUNoQixDQUFDO1FBQ0QsUUFBUSxFQUFFLENBQUMsR0FBa0IsRUFBRSxFQUFFO1lBQy9CLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxvQkFBb0IsRUFBRSxHQUFHLENBQUMsQ0FBQTtZQUNwRCxZQUFZLEdBQUcsQ0FBQyxDQUFBO1lBQ2hCLE9BQU8sR0FBRyxHQUFHLENBQUE7UUFDZixDQUFDO1FBRUQsVUFBVSxFQUFFLENBQUMsQ0FBUyxFQUFFLEVBQUU7WUFDeEIsT0FBTyxDQUFDLGdCQUFnQixFQUFFLHNCQUFzQixDQUFDLEVBQUUsQ0FBQyxDQUFBO1lBQ3BELE9BQU8sR0FBRyxRQUFRLENBQUMsQ0FB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