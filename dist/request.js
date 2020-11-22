"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.request = void 0;
var request_promise_1 = __importDefault(require("request-promise"));
var p_retry_1 = __importDefault(require("p-retry"));
var debug_1 = __importDefault(require("debug"));
var error = debug_1.default("scrapper_tools:request:error");
var warning = debug_1.default("scrapper_tools:request:warning");
var success = debug_1.default("scrapper_tools:request:success");
exports.request = (function () {
    var proxies = [];
    var currentIndex = 0;
    var retries = 5;
    var timeout = 5 * 1000;
    var userAgent = null;
    return {
        setProxy: function (pxy) {
            success("Request Module", "Setting Proxies to", pxy);
            currentIndex = 0;
            proxies = pxy;
        },
        setRetries: function (t) {
            success("Request Module", "Setting retries to " + t);
            retries = parseInt(t, 10);
        },
        setTimeout: function (t) {
            success("Request Module", "Setting Timeout to " + t);
            timeout = parseInt(t, 10) * 1000;
        },
        setUserAgent: function (value) {
            if (value === void 0) { value = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36"; }
            userAgent = value;
        },
        make: function (url, passHeaders, others) {
            if (passHeaders === void 0) { passHeaders = {}; }
            if (others === void 0) { others = {}; }
            return __awaiter(void 0, void 0, void 0, function () {
                var pxy, run, e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            pxy = "";
                            if (proxies.length === 0) {
                                pxy = null;
                            }
                            else {
                                pxy = proxies[currentIndex++ % proxies.length];
                            }
                            run = function (url, passHeaders, others) {
                                if (passHeaders === void 0) { passHeaders = {}; }
                                if (others === void 0) { others = {}; }
                                return __awaiter(void 0, void 0, void 0, function () {
                                    var response, e_2;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                _a.trys.push([0, 2, , 3]);
                                                return [4 /*yield*/, request_promise_1.default(__assign({ proxy: pxy, jar: true, strictSSL: false, uri: url, encoding: null, gzip: true, headers: __assign({ "user-agent": userAgent, "content-type": "application/json", "accept-language": "en-US,en;q=0.9" }, passHeaders), timeout: timeout }, others))];
                                            case 1:
                                                response = _a.sent();
                                                return [2 /*return*/, response];
                                            case 2:
                                                e_2 = _a.sent();
                                                if (e_2 && e_2.statusCode && e_2.statusCode >= 400) {
                                                    throw new p_retry_1.default.AbortError(e_2);
                                                }
                                                throw e_2;
                                            case 3: return [2 /*return*/];
                                        }
                                    });
                                });
                            };
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, p_retry_1.default(function () { return run(url, passHeaders, others); }, {
                                    retries: retries,
                                    onFailedAttempt: function (error) {
                                        var _a;
                                        warning("Request Module", "Attempt " + (error === null || error === void 0 ? void 0 : error.attemptNumber) + "." + (error === null || error === void 0 ? void 0 : error.retriesLeft) + " attempts left Proxy: " + pxy + " Url: " + ((_a = error === null || error === void 0 ? void 0 : error.options) === null || _a === void 0 ? void 0 : _a.uri) + ". Status Code " + error.message.statusCode);
                                    }
                                })];
                        case 2: return [2 /*return*/, _a.sent()];
                        case 3:
                            e_1 = _a.sent();
                            error("Request Module unrecoverable error:::", e_1 === null || e_1 === void 0 ? void 0 : e_1.statusCode);
                            throw e_1;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        }
    };
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVxdWVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9yZXF1ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsb0VBQTRDO0FBQzVDLG9EQUE0QjtBQUM1QixnREFBeUI7QUFFekIsSUFBSSxLQUFLLEdBQUcsZUFBSyxDQUFDLDhCQUE4QixDQUFDLENBQUE7QUFDakQsSUFBSSxPQUFPLEdBQUcsZUFBSyxDQUFDLGdDQUFnQyxDQUFDLENBQUE7QUFDckQsSUFBSSxPQUFPLEdBQUcsZUFBSyxDQUFDLGdDQUFnQyxDQUFDLENBQUE7QUFFeEMsUUFBQSxPQUFPLEdBQUcsQ0FBQztJQUN0QixJQUFJLE9BQU8sR0FBa0IsRUFBRSxDQUFBO0lBQy9CLElBQUksWUFBWSxHQUFHLENBQUMsQ0FBQTtJQUVwQixJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUE7SUFDZixJQUFJLE9BQU8sR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFBO0lBQ3RCLElBQUksU0FBUyxHQUFrQixJQUFJLENBQUE7SUFFbkMsT0FBTztRQUNMLFFBQVEsRUFBRSxVQUFDLEdBQWtCO1lBQzNCLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxvQkFBb0IsRUFBRSxHQUFHLENBQUMsQ0FBQTtZQUNwRCxZQUFZLEdBQUcsQ0FBQyxDQUFBO1lBQ2hCLE9BQU8sR0FBRyxHQUFHLENBQUE7UUFDZixDQUFDO1FBRUQsVUFBVSxFQUFFLFVBQUMsQ0FBUztZQUNwQixPQUFPLENBQUMsZ0JBQWdCLEVBQUUsd0JBQXNCLENBQUcsQ0FBQyxDQUFBO1lBQ3BELE9BQU8sR0FBRyxRQUFRLENBQUMsQ0FBUSxFQUFFLEVBQUUsQ0FBQyxDQUFBO1FBQ2xDLENBQUM7UUFFRCxVQUFVLEVBQUUsVUFBQyxDQUFTO1lBQ3BCLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSx3QkFBc0IsQ0FBRyxDQUFDLENBQUE7WUFD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