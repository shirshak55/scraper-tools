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
            let pxy = "";
            if (proxies.length === 0) {
                pxy = null;
            }
            else {
                pxy = proxies[currentIndex++ % proxies.length];
            }
            const run = async (headers = {}, others = {}) => {
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
                if (response.status === 404) {
                    throw new p_retry_1.default.AbortError(response.statusText);
                }
                return response;
            };
            try {
                return await p_retry_1.default(() => run(headers, others), {
                    retries,
                    onFailedAttempt: (error) => {
                        warning("Request Module", `Attempt ${error.attemptNumber}.${error.retriesLeft} attempts left Proxy: ${pxy} Url: ${error.options.uri} Error Message: ${error.message}`);
                    }
                });
            }
            catch (e) {
                error("Request Module", e);
            }
        }
    };
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVxdWVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9yZXF1ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsc0VBQTRDO0FBQzVDLHNEQUE0QjtBQUU1QixzREFBNkI7QUFDN0Isa0RBQXlCO0FBRXpCLElBQUksS0FBSyxHQUFHLGVBQUssQ0FBQyw4QkFBOEIsQ0FBQyxDQUFBO0FBQ2pELElBQUksT0FBTyxHQUFHLGVBQUssQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFBO0FBQ3JELElBQUksT0FBTyxHQUFHLGVBQUssQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFBO0FBRXJELGtCQUFlLENBQUMsR0FBRyxFQUFFO0lBQ25CLElBQUksT0FBTyxHQUFrQixFQUFFLENBQUE7SUFDL0IsSUFBSSxZQUFZLEdBQUcsQ0FBQyxDQUFBO0lBRXBCLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQTtJQUNmLElBQUksT0FBTyxHQUFHLENBQUMsQ0FBQTtJQUNmLElBQUksT0FBTyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUE7SUFDdEIsSUFBSSxTQUFTLEdBQWtCLElBQUksQ0FBQTtJQUVuQyxPQUFPO1FBQ0wseUJBQXlCLEVBQUUsR0FBRyxFQUFFO1lBQzlCLE9BQU8seUJBQWMsQ0FBQTtRQUN2QixDQUFDO1FBQ0Qsa0JBQWtCLEVBQUUsR0FBRyxFQUFFO1lBQ3ZCLE9BQU8saUJBQU8sQ0FBQTtRQUNoQixDQUFDO1FBQ0QsUUFBUSxFQUFFLENBQUMsR0FBa0IsRUFBRSxFQUFFO1lBQy9CLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxvQkFBb0IsRUFBRSxHQUFHLENBQUMsQ0FBQTtZQUNwRCxZQUFZLEdBQUcsQ0FBQyxDQUFBO1lBQ2hCLE9BQU8sR0FBRyxHQUFHLENBQUE7UUFDZixDQUFDO1FBRUQsU0FBUyxFQUFFLENBQUMsQ0FBUyxFQUFFLEVBQUU7WUFDdkIsT0FBTyxDQUFDLGdCQUFnQixFQUFFLHFCQUFxQixDQUFDLEVBQUUsQ0FBQyxDQUFB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