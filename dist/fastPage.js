"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fastPage = exports.makePageFaster = void 0;
const async_lock_1 = __importDefault(require("async-lock"));
const debug_1 = __importDefault(require("debug"));
const playwright_1 = __importDefault(require("playwright"));
const functionsToInject = __importStar(require("./functionToInject"));
const playwright_mini_1 = require("playwright-mini");
let error = debug_1.default("scrapper_tools:fastpage:error");
let info = debug_1.default("scrapper_tools:fastpage:info");
let lock = new async_lock_1.default();
let defaultConfig = {
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
let config = {
    default: { ...defaultConfig },
};
async function loadHooks(hooks, name, ...args) {
    hooks.filter((v) => v.name === name).forEach(async (v) => await v.action(...args));
}
async function browser(instanceName) {
    return await lock
        .acquire("instance_" + instanceName, async function () {
        let ic = config[instanceName];
        if (ic.browserHandle) {
            return ic.browserHandle;
        }
        let args = [...ic.args];
        if (ic.browser === "chromium") {
            args = args.concat([
                "--no-sandbox",
                "--allow-running-insecure-content",
                "--disable-background-timer-throttling",
                "--disable-backgrounding-occluded-windows",
                "--disable-renderer-backgrounding",
                "--disable-web-security",
                `--window-size=${ic.windowSize.width},${ic.windowSize.height}`,
            ]);
            if (ic.extensions.length > 0) {
                args.push(`--disable-extensions-except=${ic.extensions.join(",")}`, `--load-extension=${ic.extensions.join(",")}`);
            }
        }
        if (ic.userDataDir) {
            args.push(`---user-data-dir=${ic.userDataDir}`);
        }
        let launchOption = {
            headless: ic.headless,
            args,
            devtools: ic.devtools,
            acceptDownloads: true,
        };
        if (ic.downloadDir) {
            launchOption.downloadsPath = ic.downloadDir;
        }
        if (ic.proxy) {
            launchOption.proxy = ic.proxy;
        }
        if (ic.userDataDir) {
            ic.browserHandle = await playwright_1.default[ic.browser].launchPersistentContext(ic.userDataDir, {
                acceptDownloads: true,
                colorScheme: "dark",
                ...launchOption,
            });
        }
        else {
            let browser = await playwright_1.default[ic.browser].launch(launchOption);
            let contextOption = {
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
            ic.nonPersistantBrowserHandle = browser;
            ic.browserHandle = await browser.newContext(contextOption);
        }
        return ic.browserHandle;
    })
        .catch((err) => {
        error("Error on starting new page: Lock Error ->", err);
        throw err;
    });
}
async function makePageFaster(page, instanceName) {
    let instanceConfig = config[instanceName];
    await loadHooks(instanceConfig["hooks"], "make_page_faster", page);
    page.setDefaultNavigationTimeout(instanceConfig.defaultNavigationTimeout);
    page.setDefaultTimeout(instanceConfig.defaultNavigationTimeout);
    let session = null;
    if (instanceConfig.browser === "chromium") {
        session = await page.context().newCDPSession(page);
    }
    if (instanceConfig.enableStealth === true) {
        await playwright_mini_1.pageStealth(page);
    }
    await page.addScriptTag({
        content: `${functionsToInject.waitForElement} ${functionsToInject.waitForElementToBeRemoved} ${functionsToInject.delay}`,
    });
    if (instanceConfig.showPageError === true) {
        page.on("pageerror", (err) => {
            error("Error happen at the page: ", err);
        });
        page.on("pageerror", (pageerr) => {
            error("Page Error occurred: ", pageerr);
        });
    }
    if (instanceConfig.blockCSS || instanceConfig.blockFonts || instanceConfig.blockImages) {
        // await page.setRequestInterception(true)
        page.on("request", (request) => {
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
    if (session) {
        await session.send("Page.setWebLifecycleState", {
            state: "active",
        });
    }
    return { session, page };
}
exports.makePageFaster = makePageFaster;
function fastPage(instanceName = "default") {
    async function init(useCurrentDefaultConfig = true) {
        if (useCurrentDefaultConfig) {
            config[instanceName] = { ...config.default };
        }
        else {
            config[instanceName] = { ...defaultConfig };
        }
    }
    return {
        init: init,
        getBrowserHandle: async () => {
            return await browser(instanceName);
        },
        newPage: async () => {
            info("Fast Page", "Launching new page ");
            if (!config[instanceName]) {
                info("Fast Page", "Using default config");
                await init();
            }
            let brow = await browser(instanceName);
            let { page } = await makePageFaster(await brow.newPage(), instanceName);
            return page;
        },
        newPage1: async () => {
            info("Fast Page", "Launching new page with session ");
            let brow = await browser(instanceName);
            let { page, session } = await makePageFaster(await brow.newPage(), instanceName);
            return { page, session };
        },
        closeBrowser: async () => {
            info("Fast Page", "Requesting to close browser ");
            return await lock
                .acquire("instance_close_" + instanceName, async function () {
                if (config[instanceName].nonPersistantBrowserHandle) {
                    config[instanceName].nonPersistantBrowserHandle.close();
                }
                else if (config[instanceName].browserHandle) {
                    let bHandle = await browser(instanceName);
                    await bHandle.close();
                }
                config[instanceName].browserHandle = undefined;
                config[instanceName].nonPersistantBrowserHandle = undefined;
                return "closed";
            })
                .catch((err) => console.log("Error on closing browser: Lock Error ->", err));
        },
        setProxy: (value) => {
            info("Fast Page", "Setting proxy to ", value);
            config[instanceName].proxy = value;
        },
        setDefaultBrowser: (name) => {
            config[instanceName].browser = name;
        },
        setShowPageError: (value) => {
            info("Fast Page", "Setting show page error to ", value);
            config[instanceName].showPageError = value;
        },
        setHeadless: (value = false) => {
            info("Fast Page", "Setting headless to ", value);
            config[instanceName].headless = value;
        },
        setDevtools: (value = true) => {
            info("Fast Page", "Setting devtools to ", value);
            config[instanceName].devtools = value;
        },
        setUserDataDir: (value) => {
            info("Fast Page", "Storing chrome cache in  ", value);
            config[instanceName].userDataDir = value;
        },
        setUserAgent: (value) => {
            info("Fast Page", "Setting user agent in  ", value);
            config[instanceName].userAgent = value;
        },
        setWindowSizeArg: (value) => {
            info("Fast Page", "Setting window size to ", value);
            config[instanceName].windowSize = value;
        },
        setExtensionsPaths: (value) => {
            config[instanceName].extensions = value;
        },
        setStealth: (value) => {
            config[instanceName].enableStealth = value;
        },
        setDefaultNavigationTimeout: (value) => {
            info("Fast Page", "Default navigation timeout", value);
            config[instanceName].defaultNavigationTimeout = value;
        },
        setDownloadDir: (value) => {
            info("Fast Page", "Download timeout", value);
            config[instanceName].downloadDir = value;
        },
        blockImages: (value = true) => {
            info("Fast Page", "Block Image", value);
            config[instanceName].blockImages = value;
        },
        blockFonts: (value = true) => {
            info("Fast Page", "Block Font", value);
            config[instanceName].blockFonts = value;
        },
        blockCSS: (value = true) => {
            info("Fast Page", "Block CSS", value);
            config[instanceName].blockCSS = value;
        },
        getConfig(instanceName = "default") {
            if (instanceName === null) {
                return config;
            }
            return config[instanceName];
        },
        addHook(name, action) {
            config[instanceName].hooks.push({ name, action });
        },
        addArg(arg) {
            config[instanceName].args.push(arg);
        },
    };
}
exports.fastPage = fastPage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFzdFBhZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvZmFzdFBhZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDREQUFrQztBQUNsQyxrREFBeUI7QUFDekIsNERBT21CO0FBQ25CLHNFQUF1RDtBQUV2RCxxREFBNkM7QUFFN0MsSUFBSSxLQUFLLEdBQUcsZUFBSyxDQUFDLCtCQUErQixDQUFDLENBQUE7QUFDbEQsSUFBSSxJQUFJLEdBQUcsZUFBSyxDQUFDLDhCQUE4QixDQUFDLENBQUE7QUFFaEQsSUFBSSxJQUFJLEdBQUcsSUFBSSxvQkFBUyxFQUFFLENBQUE7QUErQjFCLElBQUksYUFBYSxHQUFnQjtJQUMvQixhQUFhLEVBQUUsU0FBUztJQUN4QixPQUFPLEVBQUUsVUFBVTtJQUNuQiwwQkFBMEIsRUFBRSxTQUFTO0lBQ3JDLEtBQUssRUFBRSxTQUFTO0lBQ2hCLFFBQVEsRUFBRSxLQUFLO0lBQ2YsUUFBUSxFQUFFLEtBQUs7SUFDZixXQUFXLEVBQUUsU0FBUztJQUN0QixVQUFVLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUU7SUFDdkMsVUFBVSxFQUFFLEtBQUs7SUFDakIsV0FBVyxFQUFFLEtBQUs7SUFDbEIsUUFBUSxFQUFFLEtBQUs7SUFDZixhQUFhLEVBQUUsSUFBSTtJQUNuQix3QkFBd0IsRUFBRSxFQUFFLEdBQUcsSUFBSTtJQUNuQyxVQUFVLEVBQUUsRUFBRTtJQUNkLGFBQWEsRUFBRSxLQUFLO0lBQ3BCLFNBQVMsRUFDUCwwSEFBMEg7SUFDNUgsSUFBSSxFQUFFLEVBQUU7SUFDUixLQUFLLEVBQUUsRUFBRTtJQUNULFdBQVcsRUFBRSxJQUFJO0NBQ2xCLENBQUE7QUFNRCxJQUFJLE1BQU0sR0FBVztJQUNuQixPQUFPLEVBQUUsRUFBRSxHQUFHLGFBQWEsRUFBRTtDQUM5QixDQUFBO0FBRUQsS0FBSyxVQUFVLFNB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