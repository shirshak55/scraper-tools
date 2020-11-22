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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fastPage = exports.makePageFaster = void 0;
var async_lock_1 = __importDefault(require("async-lock"));
var debug_1 = __importDefault(require("debug"));
var playwright_1 = __importDefault(require("playwright"));
var functionsToInject = __importStar(require("./functionToInject"));
var playwright_mini_1 = require("playwright-mini");
var error = debug_1.default("scrapper_tools:fastpage:error");
var info = debug_1.default("scrapper_tools:fastpage:info");
var lock = new async_lock_1.default();
var defaultConfig = {
    browserHandle: undefined,
    browser: "chromium",
    nonPersistantBrowserHandle: undefined,
    proxy: undefined,
    headless: false,
    devtools: false,
    userDataDir: undefined,
    windowSize: { width: 595, height: 842 },
    blockFonts: false,
    blockImages: false,
    blockCSS: false,
    enableStealth: true,
    defaultNavigationTimeout: 30 * 1000,
    extensions: [],
    showPageError: false,
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36",
    args: [],
    hooks: [],
    downloadDir: null,
};
var config = {
    default: __assign({}, defaultConfig),
};
function loadHooks(hooks, name) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            hooks.filter(function (v) { return v.name === name; }).forEach(function (v) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, v.action.apply(v, __spread(args))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            }); }); });
            return [2 /*return*/];
        });
    });
}
function browser(instanceName) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, lock
                        .acquire("instance_" + instanceName, function () {
                        return __awaiter(this, void 0, void 0, function () {
                            var ic, args, launchOption, _a, browser_1, contextOption, _b;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        ic = config[instanceName];
                                        if (ic.browserHandle) {
                                            return [2 /*return*/, ic.browserHandle];
                                        }
                                        args = __spread(ic.args);
                                        if (ic.browser === "chromium") {
                                            args = args.concat([
                                                "--no-sandbox",
                                                "--allow-running-insecure-content",
                                                "--disable-background-timer-throttling",
                                                "--disable-backgrounding-occluded-windows",
                                                "--disable-renderer-backgrounding",
                                                "--disable-web-security",
                                                "--window-size=" + ic.windowSize.width + "," + ic.windowSize.height,
                                            ]);
                                            if (ic.extensions.length > 0) {
                                                args.push("--disable-extensions-except=" + ic.extensions.join(","), "--load-extension=" + ic.extensions.join(","));
                                            }
                                        }
                                        if (ic.userDataDir) {
                                            args.push("---user-data-dir=" + ic.userDataDir);
                                        }
                                        launchOption = {
                                            headless: ic.headless,
                                            args: args,
                                            devtools: ic.devtools,
                                            acceptDownloads: true,
                                        };
                                        if (ic.downloadDir) {
                                            launchOption.downloadsPath = ic.downloadDir;
                                        }
                                        if (ic.proxy) {
                                            launchOption.proxy = ic.proxy;
                                        }
                                        if (!ic.userDataDir) return [3 /*break*/, 2];
                                        _a = ic;
                                        return [4 /*yield*/, playwright_1.default[ic.browser].launchPersistentContext(ic.userDataDir, __assign({ acceptDownloads: true, colorScheme: "dark" }, launchOption))];
                                    case 1:
                                        _a.browserHandle = _c.sent();
                                        return [3 /*break*/, 5];
                                    case 2: return [4 /*yield*/, playwright_1.default[ic.browser].launch(launchOption)];
                                    case 3:
                                        browser_1 = _c.sent();
                                        contextOption = {
                                            ignoreHTTPSErrors: true,
                                            acceptDownloads: true,
                                            bypassCSP: true,
                                            userAgent: ic.userAgent,
                                            colorScheme: "dark",
                                            viewport: {
                                                width: ic.windowSize.width,
                                                height: ic.windowSize.height,
                                            },
                                        };
                                        ic.nonPersistantBrowserHandle = browser_1;
                                        _b = ic;
                                        return [4 /*yield*/, browser_1.newContext(contextOption)];
                                    case 4:
                                        _b.browserHandle = _c.sent();
                                        _c.label = 5;
                                    case 5: return [2 /*return*/, ic.browserHandle];
                                }
                            });
                        });
                    })
                        .catch(function (err) {
                        error("Error on starting new page: Lock Error ->", err);
                        throw err;
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function makePageFaster(page, instanceName) {
    return __awaiter(this, void 0, void 0, function () {
        var instanceConfig, session;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    instanceConfig = config[instanceName];
                    return [4 /*yield*/, loadHooks(instanceConfig["hooks"], "make_page_faster", page)];
                case 1:
                    _a.sent();
                    page.setDefaultNavigationTimeout(instanceConfig.defaultNavigationTimeout);
                    page.setDefaultTimeout(instanceConfig.defaultNavigationTimeout);
                    session = null;
                    if (!(instanceConfig.browser === "chromium")) return [3 /*break*/, 3];
                    return [4 /*yield*/, page.context().newCDPSession(page)];
                case 2:
                    session = _a.sent();
                    _a.label = 3;
                case 3:
                    if (!(instanceConfig.enableStealth === true)) return [3 /*break*/, 5];
                    return [4 /*yield*/, playwright_mini_1.pageStealth(page)];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5: return [4 /*yield*/, page.addScriptTag({
                        content: functionsToInject.waitForElement + " " + functionsToInject.waitForElementToBeRemoved + " " + functionsToInject.delay,
                    })];
                case 6:
                    _a.sent();
                    if (instanceConfig.showPageError === true) {
                        page.on("pageerror", function (err) {
                            error("Error happen at the page: ", err);
                        });
                        page.on("pageerror", function (pageerr) {
                            error("Page Error occurred: ", pageerr);
                        });
                    }
                    if (instanceConfig.blockCSS || instanceConfig.blockFonts || instanceConfig.blockImages) {
                        // await page.setRequestInterception(true)
                        page.on("request", function (request) {
                            if ((instanceConfig.blockImages && request.resourceType() === "image") ||
                                (instanceConfig.blockFonts && request.resourceType() === "font") ||
                                (instanceConfig.blockCSS && request.resourceType() === "stylesheet")) {
                                request.abort();
                            }
                            else {
                                request.continue();
                            }
                        });
                    }
                    if (!session) return [3 /*break*/, 8];
                    return [4 /*yield*/, session.send("Page.setWebLifecycleState", {
                            state: "active",
                        })];
                case 7:
                    _a.sent();
                    _a.label = 8;
                case 8: return [2 /*return*/, { session: session, page: page }];
            }
        });
    });
}
exports.makePageFaster = makePageFaster;
function fastPage(instanceName) {
    var _this = this;
    if (instanceName === void 0) { instanceName = "default"; }
    function init(useCurrentDefaultConfig) {
        if (useCurrentDefaultConfig === void 0) { useCurrentDefaultConfig = true; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (useCurrentDefaultConfig) {
                    config[instanceName] = __assign({}, config.default);
                }
                else {
                    config[instanceName] = __assign({}, defaultConfig);
                }
                return [2 /*return*/];
            });
        });
    }
    return {
        init: init,
        getBrowserHandle: function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser(instanceName)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); },
        newPage: function () { return __awaiter(_this, void 0, void 0, function () {
            var brow, page, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        info("Fast Page", "Launching new page ");
                        if (!!config[instanceName]) return [3 /*break*/, 2];
                        info("Fast Page", "Using default config");
                        return [4 /*yield*/, init()];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2: return [4 /*yield*/, browser(instanceName)];
                    case 3:
                        brow = _b.sent();
                        _a = makePageFaster;
                        return [4 /*yield*/, brow.newPage()];
                    case 4: return [4 /*yield*/, _a.apply(void 0, [_b.sent(), instanceName])];
                    case 5:
                        page = (_b.sent()).page;
                        return [2 /*return*/, page];
                }
            });
        }); },
        newPage1: function () { return __awaiter(_this, void 0, void 0, function () {
            var brow, _a, page, session, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        info("Fast Page", "Launching new page with session ");
                        return [4 /*yield*/, browser(instanceName)];
                    case 1:
                        brow = _c.sent();
                        _b = makePageFaster;
                        return [4 /*yield*/, brow.newPage()];
                    case 2: return [4 /*yield*/, _b.apply(void 0, [_c.sent(), instanceName])];
                    case 3:
                        _a = _c.sent(), page = _a.page, session = _a.session;
                        return [2 /*return*/, { page: page, session: session }];
                }
            });
        }); },
        closeBrowser: function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        info("Fast Page", "Requesting to close browser ");
                        return [4 /*yield*/, lock
                                .acquire("instance_close_" + instanceName, function () {
                                return __awaiter(this, void 0, void 0, function () {
                                    var bHandle;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                if (!config[instanceName].nonPersistantBrowserHandle) return [3 /*break*/, 1];
                                                config[instanceName].nonPersistantBrowserHandle.close();
                                                return [3 /*break*/, 4];
                                            case 1:
                                                if (!config[instanceName].browserHandle) return [3 /*break*/, 4];
                                                return [4 /*yield*/, browser(instanceName)];
                                            case 2:
                                                bHandle = _a.sent();
                                                return [4 /*yield*/, bHandle.close()];
                                            case 3:
                                                _a.sent();
                                                _a.label = 4;
                                            case 4:
                                                config[instanceName].browserHandle = undefined;
                                                config[instanceName].nonPersistantBrowserHandle = undefined;
                                                return [2 /*return*/, "closed"];
                                        }
                                    });
                                });
                            })
                                .catch(function (err) { return console.log("Error on closing browser: Lock Error ->", err); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); },
        setProxy: function (value) {
            info("Fast Page", "Setting proxy to ", value);
            config[instanceName].proxy = value;
        },
        setDefaultBrowser: function (name) {
            config[instanceName].browser = name;
        },
        setShowPageError: function (value) {
            info("Fast Page", "Setting show page error to ", value);
            config[instanceName].showPageError = value;
        },
        setHeadless: function (value) {
            if (value === void 0) { value = false; }
            info("Fast Page", "Setting headless to ", value);
            config[instanceName].headless = value;
        },
        setDevtools: function (value) {
            if (value === void 0) { value = true; }
            info("Fast Page", "Setting devtools to ", value);
            config[instanceName].devtools = value;
        },
        setUserDataDir: function (value) {
            info("Fast Page", "Storing chrome cache in  ", value);
            config[instanceName].userDataDir = value;
        },
        setUserAgent: function (value) {
            info("Fast Page", "Setting user agent in  ", value);
            config[instanceName].userAgent = value;
        },
        setWindowSizeArg: function (value) {
            info("Fast Page", "Setting window size to ", value);
            config[instanceName].windowSize = value;
        },
        setExtensionsPaths: function (value) {
            config[instanceName].extensions = value;
        },
        setStealth: function (value) {
            config[instanceName].enableStealth = value;
        },
        setDefaultNavigationTimeout: function (value) {
            info("Fast Page", "Default navigation timeout", value);
            config[instanceName].defaultNavigationTimeout = value;
        },
        setDownloadDir: function (value) {
            info("Fast Page", "Download timeout", value);
            config[instanceName].downloadDir = value;
        },
        blockImages: function (value) {
            if (value === void 0) { value = true; }
            info("Fast Page", "Block Image", value);
            config[instanceName].blockImages = value;
        },
        blockFonts: function (value) {
            if (value === void 0) { value = true; }
            info("Fast Page", "Block Font", value);
            config[instanceName].blockFonts = value;
        },
        blockCSS: function (value) {
            if (value === void 0) { value = true; }
            info("Fast Page", "Block CSS", value);
            config[instanceName].blockCSS = value;
        },
        getConfig: function (instanceName) {
            if (instanceName === void 0) { instanceName = "default"; }
            if (instanceName === null) {
                return config;
            }
            return config[instanceName];
        },
        addHook: function (name, action) {
            config[instanceName].hooks.push({ name: name, action: action });
        },
        addArg: function (arg) {
            config[instanceName].args.push(arg);
        },
    };
}
exports.fastPage = fastPage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFzdFBhZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvZmFzdFBhZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwwREFBa0M7QUFDbEMsZ0RBQXlCO0FBQ3pCLDBEQU9tQjtBQUNuQixvRUFBdUQ7QUFFdkQsbURBQTZDO0FBRTdDLElBQUksS0FBSyxHQUFHLGVBQUssQ0FBQywrQkFBK0IsQ0FBQyxDQUFBO0FBQ2xELElBQUksSUFBSSxHQUFHLGVBQUssQ0FBQyw4QkFBOEIsQ0FBQyxDQUFBO0FBRWhELElBQUksSUFBSSxHQUFHLElBQUksb0JBQVMsRUFBRSxDQUFBO0FBK0IxQixJQUFJLGFBQWEsR0FBZ0I7SUFDL0IsYUFBYSxFQUFFLFNBQVM7SUFDeEIsT0FBTyxFQUFFLFVBQVU7SUFDbkIsMEJBQTBCLEVBQUUsU0FBUztJQUNyQyxLQUFLLEVBQUUsU0FBUztJQUNoQixRQUFRLEVBQUUsS0FBSztJQUNmLFFBQVEsRUFBRSxLQUFLO0lBQ2YsV0FBVyxFQUFFLFNBQVM7SUFDdEIsVUFBVSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFO0lBQ3ZDLFVBQVUsRUFBRSxLQUFLO0lBQ2pCLFdBQVcsRUFBRSxLQUFLO0lBQ2xCLFFBQVEsRUFBRSxLQUFLO0lBQ2YsYUFBYSxFQUFFLElBQUk7SUFDbkIsd0JBQXdCLEVBQUUsRUFBRSxHQUFHLElBQUk7SUFDbkMsVUFBVSxFQUFFLEVBQUU7SUFDZCxhQUFhLEVBQUUsS0FBSztJQUNwQixTQUFTLEVBQ1AsMEhBQTBIO0lBQzVILElBQUksRUFBRSxFQUFFO0lBQ1IsS0FBSyxFQUFFLEVBQUU7SUFDVCxXQUFXLEVBQUUsSUFBSTtDQUNsQixDQUFBO0FBTUQsSUFBSSxNQUFNLEdB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