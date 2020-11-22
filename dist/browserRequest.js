"use strict";
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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonBrowserRequest = exports.concurrentBrowserRequest = exports.singleBrowserRequest = exports.addBrowserRequestHooks = exports.browserRequest = void 0;
var lodash_1 = __importDefault(require("lodash"));
var async_lock_1 = __importDefault(require("async-lock"));
var lock = new async_lock_1.default({ maxPending: 5000 });
var hooks = [];
function browserRequest(page, config) {
    if (config === void 0) { config = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var hooks_1, hooks_1_1, hook, e_1_1, defaultCfg, fetchConfig, evaluated;
        var e_1, _a;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 5, 6, 7]);
                    hooks_1 = __values(hooks), hooks_1_1 = hooks_1.next();
                    _b.label = 1;
                case 1:
                    if (!!hooks_1_1.done) return [3 /*break*/, 4];
                    hook = hooks_1_1.value;
                    return [4 /*yield*/, hook(page, config)];
                case 2:
                    _b.sent();
                    _b.label = 3;
                case 3:
                    hooks_1_1 = hooks_1.next();
                    return [3 /*break*/, 1];
                case 4: return [3 /*break*/, 7];
                case 5:
                    e_1_1 = _b.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 7];
                case 6:
                    try {
                        if (hooks_1_1 && !hooks_1_1.done && (_a = hooks_1.return)) _a.call(hooks_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                    return [7 /*endfinally*/];
                case 7:
                    if (!config.url) {
                        throw "URL is not given. Please provide Url";
                    }
                    defaultCfg = {
                        credentials: "include",
                        headers: {},
                        body: null,
                        redirect: "follow",
                        mode: "cors",
                    };
                    if (!config.method) {
                        defaultCfg.method = "GET";
                    }
                    fetchConfig = lodash_1.default.merge({}, defaultCfg, config);
                    return [4 /*yield*/, page.evaluate(function (fetchConfig) { return __awaiter(_this, void 0, void 0, function () {
                            var res, toRet;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, fetch(fetchConfig.url, fetchConfig)];
                                    case 1:
                                        res = _a.sent();
                                        return [4 /*yield*/, res.text()];
                                    case 2:
                                        toRet = _a.sent();
                                        return [2 /*return*/, toRet];
                                }
                            });
                        }); }, fetchConfig)];
                case 8:
                    evaluated = _b.sent();
                    return [2 /*return*/, evaluated];
            }
        });
    });
}
exports.browserRequest = browserRequest;
// Async just in case in future we need to add some await here
function addBrowserRequestHooks(func) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            hooks.push(func);
            return [2 /*return*/];
        });
    });
}
exports.addBrowserRequestHooks = addBrowserRequestHooks;
function singleBrowserRequest(page, config) {
    if (config === void 0) { config = {}; }
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, lock.acquire("singleBrowserRequest", function singleBrowserRequestLock() {
                        return __awaiter(this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, browserRequest(page, config)];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            });
                        });
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.singleBrowserRequest = singleBrowserRequest;
var concurrentRequestId = 0;
function concurrentBrowserRequest(page, concurrency, config) {
    if (config === void 0) { config = {}; }
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    concurrentRequestId = (concurrentRequestId + 1) % concurrency;
                    return [4 /*yield*/, lock.acquire("singleBrowserRequest" + concurrentRequestId, function singleBrowserRequestLock() {
                            return __awaiter(this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, browserRequest(page, config)];
                                        case 1: return [2 /*return*/, _a.sent()];
                                    }
                                });
                            });
                        })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.concurrentBrowserRequest = concurrentBrowserRequest;
function jsonBrowserRequest(a, b) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (!b.headers) {
                b.headers = {};
            }
            b.headers["content-type"] = "application/json;charset=UTF-8";
            return [2 /*return*/, browserRequest(a, b)];
        });
    });
}
exports.jsonBrowserRequest = jsonBrowserRequest;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJvd3NlclJlcXVlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvYnJvd3NlclJlcXVlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxrREFBc0I7QUFDdEIsMERBQWtDO0FBRWxDLElBQUksSUFBSSxHQUFHLElBQUksb0JBQVMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFBO0FBRTlDLElBQUksS0FBSyxHQUE0QyxFQUFFLENBQUE7QUFFdkQsU0FBc0IsY0FBYyxDQUFDLElBQVUsRUFBRSxNQUFnQjtJQUFoQix1QkFBQSxFQUFBLFdBQWdCOzs7Ozs7Ozs7b0JBQzlDLFVBQUEsU0FBQSxLQUFLLENBQUE7Ozs7b0JBQWIsSUFBSTtvQkFDWCxxQkFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxFQUFBOztvQkFBeEIsU0FBd0IsQ0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7b0JBRzFCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFO3dCQUNmLE1BQU0sc0NBQXNDLENBQUE7cUJBQzdDO29CQUVHLFVBQVUsR0FBUTt3QkFDcEIsV0FBVyxFQUFFLFNBQVM7d0JBQ3RCLE9BQU8sRUFBRSxFQUFFO3dCQUNYLElBQUksRUFBRSxJQUFJO3dCQUNWLFFBQVEsRUFBRSxRQUFRO3dCQUNsQixJQUFJLEVBQUUsTUFBTTtxQkFDYixDQUFBO29CQUVELElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFO3dCQUNsQixVQUFVLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQTtxQkFDMUI7b0JBRUcsV0FBVyxHQUFHLGdCQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUE7b0JBRWpDLHFCQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBTyxXQUFXOzs7OzRDQUMxQyxxQkFBTSxLQUFLLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRSxXQUFXLENBQUMsRUFBQTs7d0NBQS9DLEdBQUcsR0FBRyxTQUF5Qzt3Q0FDdkMscUJBQU0sR0FBRyxDQUFDLElBQUksRUFBRSxFQUFBOzt3Q0FBeEIsS0FBSyxHQUFHLFNBQWdCO3dDQUM1QixzQkFBTyxLQUFLLEVBQUE7Ozs2QkFDYixFQUFFLFdBQVcsQ0FBQyxFQUFBOztvQkFKWCxTQUFTLEdBQUcsU0FJRDtvQkFDZixzQkFBTyxTQUFTLEVBQUE7Ozs7Q0FDakI7QUE3QkQsd0NBNkJDO0FBRUQsOERBQThEO0FBQzlELFNBQXNCLHNCQUFzQixDQUFDLElBQXNDOzs7WUFDakYsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTs7OztDQUNqQjtBQUZELHdEQUVDO0FBRUQsU0FBc0Isb0JBQW9CLENBQUMsSUFBVSxFQUFFLE1BQWdCO0lBQWhCLHVCQUFBLEVBQUEsV0FBZ0I7Ozs7d0JBQzlELHFCQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsc0JBQXNCLEVBQUUsU0FBZSx3QkFBd0I7Ozs7NENBQ2hGLHFCQUFNLGNBQWMsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLEVBQUE7NENBQXpDLHNCQUFPLFNBQWtDLEVBQUE7Ozs7cUJBQzFDLENBQUMsRUFBQTt3QkFGRixzQkFBTyxTQUVMLEVBQUE7Ozs7Q0FDSDtBQUpELG9EQUlDO0FBRUQsSUFBSSxtQkFBbUIsR0FBRyxDQUFDLENBQUE7QUFDM0IsU0FBc0Isd0JBQXdCLENBQUMsSUFBVSxFQUFFLFdBQW1CLEVBQUUsTUFBZ0I7SUFBaEIsdUJBQUEsRUFBQSxXQUFnQjs7Ozs7b0JBQzlGLG1CQUFtQixHQUFHLENBQUMsbUJBQW1CLEdBQUcsQ0FBQyxDQUFDLEdBQUcsV0FBVyxDQUFBO29CQUV0RCxxQkFBTSxJQUFJLENBQUMsT0FBTyxDQUN2QixzQkFBc0IsR0FBRyxtQkFBbUIsRUFDNUMsU0FBZSx3QkFBd0I7Ozs7Z0RBQzlCLHFCQUFNLGNBQWMsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLEVBQUE7Z0RBQXpDLHNCQUFPLFNBQWtDLEVBQUE7Ozs7eUJBQzFDLENBQ0YsRUFBQTt3QkFMRCxzQkFBTyxTQUtOLEVBQUE7Ozs7Q0FDRjtBQVRELDREQVNDO0FBRUQsU0FBc0Isa0JBQWtCLENBQUMsQ0FBTyxFQUFFLENBQU07OztZQUN0RCxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRTtnQkFDZCxDQUFDLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQTthQUNmO1lBRUQsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsR0FBRyxnQ0FBZ0MsQ0FBQTtZQUU1RCxzQkFBTyxjQUFjLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFBOzs7Q0FDNUI7QUFSRCxnREFRQyJ9