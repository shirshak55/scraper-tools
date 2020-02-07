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
            var _a;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVxdWVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9yZXF1ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsc0VBQTRDO0FBQzVDLHNEQUE0QjtBQUU1QixzREFBNkI7QUFDN0Isa0RBQXlCO0FBRXpCLElBQUksS0FBSyxHQUFHLGVBQUssQ0FBQyw4QkFBOEIsQ0FBQyxDQUFBO0FBQ2pELElBQUksT0FBTyxHQUFHLGVBQUssQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFBO0FBQ3JELElBQUksT0FBTyxHQUFHLGVBQUssQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFBO0FBRXJELGtCQUFlLENBQUMsR0FBRyxFQUFFO0lBQ25CLElBQUksT0FBTyxHQUFrQixFQUFFLENBQUE7SUFDL0IsSUFBSSxZQUFZLEdBQUcsQ0FBQyxDQUFBO0lBRXBCLElBQUksT0FBTyxHQUFHLENBQUMsQ0FBQTtJQUNmLElBQUksT0FBTyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUE7SUFDdEIsSUFBSSxTQUFTLEdBQWtCLElBQUksQ0FBQTtJQUVuQyxPQUFPO1FBQ0wseUJBQXlCLEVBQUUsR0FBRyxFQUFFO1lBQzlCLE9BQU8seUJBQWMsQ0FBQTtRQUN2QixDQUFDO1FBQ0Qsa0JBQWtCLEVBQUUsR0FBRyxFQUFFO1lBQ3ZCLE9BQU8saUJBQU8sQ0FBQTtRQUNoQixDQUFDO1FBQ0QsUUFBUSxFQUFFLENBQUMsR0FBa0IsRUFBRSxFQUFFO1lBQy9CLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxvQkFBb0IsRUFBRSxHQUFHLENBQUMsQ0FBQTtZQUNwRCxZQUFZLEdBQUcsQ0FBQyxDQUFBO1lBQ2hCLE9BQU8sR0FBRyxHQUFHLENBQUE7UUFDZixDQUFDO1FBRUQsVUFBVSxFQUFFLENBQUMsQ0FBUyxFQUFFLEVBQUU7WUFDeEIsT0FBTyxDQUFDLGdCQUFnQixFQUFFLHNCQUFzQixDQUFDLEVBQUUsQ0FBQyxDQUFBO1lBQ3BELE9BQU8sR0FBRyxRQUFRLENBQUMsQ0FB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