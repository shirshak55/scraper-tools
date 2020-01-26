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
        make: async (url) => {
            let pxy = "";
            if (proxies.length === 0) {
                pxy = null;
            }
            else {
                pxy = proxies[currentIndex++ % proxies.length];
            }
            const run = async (headers = null) => {
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
                    timeout
                });
            };
            try {
                return await p_retry_1.default(run, {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVxdWVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9yZXF1ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsc0VBQTZDO0FBQzdDLHNEQUE2QjtBQUM3QixzRUFBOEM7QUFDOUMsc0RBQThCO0FBRTlCLGtCQUFlLENBQUMsR0FBRyxFQUFFO0lBQ25CLElBQUksT0FBTyxHQUFrQixFQUFFLENBQUM7SUFDaEMsSUFBSSxZQUFZLEdBQUcsQ0FBQyxDQUFDO0lBRXJCLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztJQUNoQixJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUM7SUFDaEIsSUFBSSxPQUFPLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQztJQUN2QixJQUFJLFNBQVMsR0FBa0IsSUFBSSxDQUFDO0lBRXBDLE9BQU87UUFDTCx5QkFBeUIsRUFBRSxHQUFHLEVBQUU7WUFDOUIsT0FBTyx5QkFBYyxDQUFDO1FBQ3hCLENBQUM7UUFDRCxrQkFBa0IsRUFBRSxHQUFHLEVBQUU7WUFDdkIsT0FBTyxpQkFBTyxDQUFDO1FBQ2pCLENBQUM7UUFDRCxRQUFRLEVBQUUsQ0FBQyxHQUFrQixFQUFFLEVBQUU7WUFDL0Isd0JBQWMsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLEVBQUUsb0JBQW9CLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDcEUsWUFBWSxHQUFHLENBQUMsQ0FBQztZQUNqQixPQUFPLEdBQUcsR0FBRyxDQUFDO1FBQ2hCLENBQUM7UUFFRCxTQUFTLEVBQUUsQ0FBQyxDQUFTLEVBQUUsRUFBRTtZQUN2Qix3QkFBYyxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxxQkFBcUIsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNuRSxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQ2IsQ0FBQztRQUVELFVBQVUsRUFBRSxDQUFDLENBQVMsRUFBRSxFQUFFO1lBQ3hCLHdCQUFjLENBQUMsT0FBTyxDQUFDLGdCQUFnQixFQUFFLHNCQUFzQixDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3BFLE9BQU8sR0FBRyxRQUFRLENBQUMsQ0FBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ25DLENBQUM7UUFFRCxVQUFVLEVBQUUsQ0FBQyxDQUFTLEVBQUUsRUFBRTtZQUN4Qix3QkFBYyxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxzQkFBc0IsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNwRSxPQUFPLEdBQUcsUUFBUSxDQUFDLENBQVEsRUFBRSxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUM7UUFDMUMsQ0FBQztRQUVELFlBQVksRUFBRSxDQUNaLFFBQWdCLDBIQUEwSCxFQUMxSSxFQUFFO1lBQ0YsU0FBUyxHQUFHLEtBQUssQ0FBQztRQUNwQixDQUFDO1FBRUQsSUFBSSxFQUFFLEtBQUssRUFBRSxHQUFXLEVBQUUsRUFBRTtZQUMxQixJQUFJLEdBQUcsR0FBa0IsRUFBRSxDQUFDO1lBRTVCLElBQUksT0FBTyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7Z0JBQ3hCLEdBQUcsR0FBRyxJQUFJLENBQUM7YUFDWjtpQkFBTTtnQkFDTCxHQUFHLEdBQUcsT0FBTyxDQUFDLFlBQVksRUFBRSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQzthQUNoRDtZQUVELE1BQU0sR0FBRyxHQUFHLEtBQUssRUFBRSxVQUFlLElBQUksRUFBRSxFQUFFO2dCQUN4QyxPQUFPLE1BQU0seUJBQWMsQ0FBQztvQkFDMUIsS0FBSyxFQUFFLEdBQUc7b0JBQ1YsR0FBRyxFQUFFLElBQUk7b0JBQ1QsU0FBUyxFQUFFLEtBQUs7b0JBQ2hCLEdBQUcsRUFBRSxHQUFHO29CQUNSLFFBQVEsRUFBRSxJQUFJO29CQUNkLElBQUksRUFBRSxJQUFJO29CQUNWLE9BQU8sRUFBRTt3QkFDUCxNQUFNO3dCQUNOLFlBQVksRUFBRSxTQUFTO3dCQUN2QixjQUFjLEVBQUUsa0JBQWtCO3dCQUNsQyxpQkFBaUIsRUFBRSxnQkFBZ0I7d0JBQ25DLEdBQUcsT0FBTztxQkFDWDtvQkFDRCxPQUFPO2lCQUNSLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQztZQUNGLElBQUk7Z0JBQ0YsT0FBTyxNQUFNLGlCQUFNLENBQUMsR0FBRyxFQUFFO29CQUN2QixPQUFPO29CQUNQLGVBQWUsRUFBRSxDQUFDLEtBQVUsRUFBRSxFQUFFO3dCQUM5Qix3QkFBYyxDQUFDLE9BQU8sQ0FDcEIsZ0JBQWdCLEVBQ2hCLFdBQVcsS0FBSyxDQUFDLGFBQWEsc0JBQXNCLEtBQUssQ0FBQyxXQUFXLDBCQUEwQixHQUFHLFNBQVMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLG1CQUFtQixLQUFLLENBQUMsT0FBTyxHQUFHLENBQ2hLLENBQUM7b0JBQ0osQ0FBQztpQkFDRixDQUFDLENBQUM7YUFDSjtZQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUNWLHdCQUFjLENBQUMsS0FBSyxDQUFDLGdCQUFnQixFQUFFLENBQUMsQ0FBQyxDQUFDO2FBQzNDO1FBQ0gsQ0FBQztLQUNGLENBQUM7QUFDSixDQUFDLENBQUMsRUFBRSxDQUFDIn0=