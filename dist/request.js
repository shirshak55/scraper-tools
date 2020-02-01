"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_promise_1 = __importDefault(require("request-promise"));
const p_retry_1 = __importDefault(require("p-retry"));
const consoleMessage_1 = __importDefault(require("./consoleMessage"));
const request_1 = __importDefault(require("request"));
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
            consoleMessage_1.default.success("Request Module", `Setting Proxies to`, pxy);
            currentIndex = 0;
            proxies = pxy;
        },
        setCookie: (c) => {
            consoleMessage_1.default.success("Request Module", `Setting Cookie to ${c}`);
            cookie = c;
        },
        setRetries: (t) => {
            consoleMessage_1.default.success("Request Module", `Setting retries to ${t}`);
            retries = parseInt(t, 10);
        },
        setTimeout: (t) => {
            consoleMessage_1.default.success("Request Module", `Setting Timeout to ${t}`);
            timeout = parseInt(t, 10) * 1000;
        },
        setUserAgent: (value = `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36`) => {
            userAgent = value;
        },
        make: async (url, headers, others = {}) => {
            let pxy = "";
            if (proxies.length === 0) {
                pxy = null;
            }
            else {
                pxy = proxies[currentIndex++ % proxies.length];
            }
            const run = async (headers = {}, others = {}) => {
                return await request_promise_1.default({
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
            };
            try {
                return await p_retry_1.default(() => run(headers, others), {
                    retries,
                    onFailedAttempt: (error) => {
                        consoleMessage_1.default.warning("Request Module", `Attempt ${error.attemptNumber} failed. There are ${error.retriesLeft} attempts left. Proxy: ${pxy} Url: ${error.options.uri} Error Message: ${error.message} `);
                    }
                });
            }
            catch (e) {
                consoleMessage_1.default.error("Request Module", e);
            }
        }
    };
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVxdWVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9yZXF1ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsc0VBQTRDO0FBQzVDLHNEQUE0QjtBQUM1QixzRUFBNkM7QUFDN0Msc0RBQTZCO0FBRTdCLGtCQUFlLENBQUMsR0FBRyxFQUFFO0lBQ25CLElBQUksT0FBTyxHQUFrQixFQUFFLENBQUE7SUFDL0IsSUFBSSxZQUFZLEdBQUcsQ0FBQyxDQUFBO0lBRXBCLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQTtJQUNmLElBQUksT0FBTyxHQUFHLENBQUMsQ0FBQTtJQUNmLElBQUksT0FBTyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUE7SUFDdEIsSUFBSSxTQUFTLEdBQWtCLElBQUksQ0FBQTtJQUVuQyxPQUFPO1FBQ0wseUJBQXlCLEVBQUUsR0FBRyxFQUFFO1lBQzlCLE9BQU8seUJBQWMsQ0FBQTtRQUN2QixDQUFDO1FBQ0Qsa0JBQWtCLEVBQUUsR0FBRyxFQUFFO1lBQ3ZCLE9BQU8saUJBQU8sQ0FBQTtRQUNoQixDQUFDO1FBQ0QsUUFBUSxFQUFFLENBQUMsR0FBa0IsRUFBRSxFQUFFO1lBQy9CLHdCQUFjLENBQUMsT0FBTyxDQUFDLGdCQUFnQixFQUFFLG9CQUFvQixFQUFFLEdBQUcsQ0FBQyxDQUFBO1lBQ25FLFlBQVksR0FBRyxDQUFDLENBQUE7WUFDaEIsT0FBTyxHQUFHLEdBQUcsQ0FBQTtRQUNmLENBQUM7UUFFRCxTQUFTLEVBQUUsQ0FBQyxDQUFTLEVBQUUsRUFBRTtZQUN2Qix3QkFBYyxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxxQkFBcUIsQ0FBQyxFQUFFLENBQUMsQ0FBQTtZQUNsRSxNQUFNLEdBQUcsQ0FBQyxDQUFBO1FBQ1osQ0FBQztRQUVELFVBQVUsRUFBRSxDQUFDLENBQVMsRUFBRSxFQUFFO1lBQ3hCLHdCQUFjLENBQUMsT0FBTyxDQUFDLGdCQUFnQixFQUFFLHNCQUFzQixDQUFDLEVBQUUsQ0FBQyxDQUFBO1lBQ25FLE9BQU8sR0FBRyxRQUFRLENBQUMsQ0FBUSxFQUFFLEVBQUUsQ0FBQyxDQUFBO1FBQ2xDLENBQUM7UUFFRCxVQUFVLEVBQUUsQ0FBQyxDQUFTLEVBQUUsRUFBRTtZQUN4Qix3QkFBYyxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxzQkFBc0IsQ0FBQyxFQUFFLENBQUMsQ0FBQTtZQUNuRSxPQUFPLEdBQUcsUUFBUSxDQUFDLENBQVEsRUFBRSxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUE7UUFDekMsQ0FBQztRQUVELFlBQVksRUFBRSxDQUNaLFFBQWdCLDBIQUEwSCxFQUMxSSxFQUFFO1lBQ0YsU0FBUyxHQUFHLEtBQUssQ0FBQTtRQUNuQixDQUFDO1FBRUQsSUFBSSxFQUFFLEtBQUssRUFBRSxHQUFXLEVBQUUsT0FBWSxFQUFFLFNBQWMsRUFBRSxFQUFFLEVBQUU7WUFDMUQsSUFBSSxHQUFHLEdBQWtCLEVBQUUsQ0FBQTtZQUUzQixJQUFJLE9BQU8sQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO2dCQUN4QixHQUFHLEdBQUcsSUFBSSxDQUFBO2FBQ1g7aUJBQU07Z0JBQ0wsR0FBRyxHQUFHLE9BQU8sQ0FBQyxZQUFZLEVBQUUsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7YUFDL0M7WUFFRCxNQUFNLEdBQUcsR0FBRyxLQUFLLEVBQUUsVUFBZSxFQUFFLEVBQUUsTUFBTSxHQUFHLEVBQUUsRUFBRSxFQUFFO2dCQUNuRCxPQUFPLE1BQU0seUJBQWMsQ0FBQztvQkFDMUIsS0FBSyxFQUFFLEdBQUc7b0JBQ1YsR0FBRyxFQUFFLElBQUk7b0JBQ1QsU0FBUyxFQUFFLEtBQUs7b0JBQ2hCLEdBQUcsRUFBRSxHQUFHO29CQUNSLFFBQVEsRUFBRSxJQUFJO29CQUNkLElBQUksRUFBRSxJQUFJO29CQUNWLE9BQU8sRUFBRTt3QkFDUCxNQUFNO3dCQUNOLFlBQVksRUFBRSxTQUFTO3dCQUN2QixjQUFjLEVBQUUsa0JBQWtCO3dCQUNsQyxpQkFBaUIsRUFBRSxnQkFBZ0I7d0JBQ25DLEdBQUcsT0FBTztxQkFDWDtvQkFDRCxPQUFPO29CQUNQLEdBQUcsTUFBTTtpQkFDVixDQUFDLENBQUE7WUFDSixDQUFDLENBQUE7WUFDRCxJQUFJO2dCQUNGLE9BQU8sTUFBTSxpQkFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLEVBQUU7b0JBQzlDLE9BQU87b0JBQ1AsZUFBZSxFQUFFLENBQUMsS0FBVSxFQUFFLEVBQUU7d0JBQzlCLHdCQUFjLENBQUMsT0FBTyxDQUNwQixnQkFBZ0IsRUFDaEIsV0FBVyxLQUFLLENBQUMsYUFBYSxzQkFBc0IsS0FBSyxDQUFDLFdBQVcsMEJBQTBCLEdBQUcsU0FBUyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsbUJBQW1CLEtBQUssQ0FBQyxPQUFPLEdBQUcsQ0FDaEssQ0FBQTtvQkFDSCxDQUFDO2lCQUNGLENBQUMsQ0FBQTthQUNIO1lBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQ1Ysd0JBQWMsQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDLENBQUE7YUFDMUM7UUFDSCxDQUFDO0tBQ0YsQ0FBQTtBQUNILENBQUMsQ0FBQyxFQUFFLENBQUEifQ==