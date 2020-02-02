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
    let cookie = "";
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
        setCookie: (c) => {
            success("Request Module", `Setting Cookie to ${c}`);
            cookie = c;
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
        make: async (url, headers = {}, others = {}) => {
            var _a;
            let pxy = "";
            if (proxies.length === 0) {
                pxy = null;
            }
            else {
                pxy = proxies[currentIndex++ % proxies.length];
            }
            const run = async (headers = {}, others = {}) => {
                try {
                    let response = await request_promise_1.default({
                        proxy: pxy,
                        jar: true,
                        strictSSL: false,
                        uri: url,
                        encoding: null,
                        gzip: true,
                        headers: {
                            cookie,
                            "user-agent": userAgent,
                            "content-type": "application/json",
                            "accept-language": "en-US,en;q=0.9",
                            ...headers
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
                return await p_retry_1.default(() => run(headers, others), {
                    retries,
                    onFailedAttempt: (error) => {
                        var _a, _b, _c, _d;
                        warning("Request Module", `Attempt ${(_a = error) === null || _a === void 0 ? void 0 : _a.attemptNumber}.${(_b = error) === null || _b === void 0 ? void 0 : _b.retriesLeft} attempts left Proxy: ${pxy} Url: ${(_d = (_c = error) === null || _c === void 0 ? void 0 : _c.options) === null || _d === void 0 ? void 0 : _d.uri}. Status Code ${error.message.statusCode}`);
                    }
                });
            }
            catch (e) {
                error("Request Module unrecoverable error:::", (_a = e) === null || _a === void 0 ? void 0 : _a.statusCode);
                throw e;
            }
        }
    };
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVxdWVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9yZXF1ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsc0VBQTRDO0FBQzVDLHNEQUE0QjtBQUU1QixzREFBNkI7QUFDN0Isa0RBQXlCO0FBRXpCLElBQUksS0FBSyxHQUFHLGVBQUssQ0FBQyw4QkFBOEIsQ0FBQyxDQUFBO0FBQ2pELElBQUksT0FBTyxHQUFHLGVBQUssQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFBO0FBQ3JELElBQUksT0FBTyxHQUFHLGVBQUssQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFBO0FBRXJELGtCQUFlLENBQUMsR0FBRyxFQUFFO0lBQ25CLElBQUksT0FBTyxHQUFrQixFQUFFLENBQUE7SUFDL0IsSUFBSSxZQUFZLEdBQUcsQ0FBQyxDQUFBO0lBRXBCLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQTtJQUNmLElBQUksT0FBTyxHQUFHLENBQUMsQ0FBQTtJQUNmLElBQUksT0FBTyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUE7SUFDdEIsSUFBSSxTQUFTLEdBQWtCLElBQUksQ0FBQTtJQUVuQyxPQUFPO1FBQ0wseUJBQXlCLEVBQUUsR0FBRyxFQUFFO1lBQzlCLE9BQU8seUJBQWMsQ0FBQTtRQUN2QixDQUFDO1FBQ0Qsa0JBQWtCLEVBQUUsR0FBRyxFQUFFO1lBQ3ZCLE9BQU8saUJBQU8sQ0FBQTtRQUNoQixDQUFDO1FBQ0QsUUFBUSxFQUFFLENBQUMsR0FBa0IsRUFBRSxFQUFFO1lBQy9CLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxvQkFBb0IsRUFBRSxHQUFHLENBQUMsQ0FBQTtZQUNwRCxZQUFZLEdBQUcsQ0FBQyxDQUFBO1lBQ2hCLE9BQU8sR0FBRyxHQUFHLENBQUE7UUFDZixDQUFDO1FBRUQsU0FBUyxFQUFFLENBQUMsQ0FBUyxFQUFFLEVBQUU7WUFDdkIsT0FBTyxDQUFDLGdCQUFnQixFQUFFLHFCQUFxQixDQUFDLEVBQUUsQ0FBQyxDQUFB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