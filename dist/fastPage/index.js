"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fastPage = exports.makePageFaster = void 0;
const async_lock_1 = __importDefault(require("async-lock"));
const debug_1 = __importDefault(require("debug"));
const playwright_1 = __importDefault(require("playwright"));
const functionToInject_1 = __importDefault(require("../functionToInject"));
const pageStealth_1 = __importDefault(require("./pageStealth"));
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
        if (config[instanceName].browserHandle)
            return config[instanceName].browserHandle;
        let args = [
            "--no-sandbox",
            `--window-size=${config[instanceName].windowSize.width},${config[instanceName].windowSize.height}`,
            "--disable-features=site-per-process",
            "--enable-features=NetworkService",
            "--allow-running-insecure-content",
            "--enable-automation",
            "--disable-background-timer-throttling",
            "--disable-backgrounding-occluded-windows",
            "--disable-renderer-backgrounding",
            "--disable-web-security",
            ...config[instanceName].args,
        ];
        if (config[instanceName].userDataDir) {
            args.push(`---user-data-dir=${config[instanceName].userDataDir}`);
        }
        if (config[instanceName].extensions.length > 0) {
            args.push(`--disable-extensions-except=${config[instanceName].extensions.join(",")}`, `--load-extension=${config[instanceName].extensions.join(",")}`);
        }
        let launchOption = {
            headless: config[instanceName].headless,
            args,
            devtools: config[instanceName].devtools,
            acceptDownloads: true,
        };
        if (config[instanceName].downloadDir) {
            launchOption.downloadsPath = config[instanceName].downloadDir;
        }
        if (config[instanceName].proxy) {
            launchOption.proxy = config[instanceName].proxy;
        }
        let contextOption = {
            ignoreHTTPSErrors: true,
            acceptDownloads: true,
            bypassCSP: true,
            userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36",
            colorScheme: "dark",
        };
        if (config[instanceName].userDataDir) {
            config[instanceName].browserHandle = await playwright_1.default[config[instanceName].browser].launchPersistentContext(config[instanceName].userDataDir, {
                acceptDownloads: true,
                colorScheme: "dark",
                ...launchOption,
            });
        }
        else {
            let browser = await playwright_1.default[config[instanceName].browser].launch(launchOption);
            config[instanceName].nonPersistantBrowserHandle = browser;
            config[instanceName].browserHandle = await browser.newContext(contextOption);
        }
        return config[instanceName].browserHandle;
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
        await pageStealth_1.default(page);
    }
    await page.addScriptTag({
        content: `${functionToInject_1.default.waitForElement} ${functionToInject_1.default.waitForElementToBeRemoved} ${functionToInject_1.default.delay}`,
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
            return config.instanceName;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZmFzdFBhZ2UvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsNERBQWtDO0FBQ2xDLGtEQUF5QjtBQUN6Qiw0REFRbUI7QUFDbkIsMkVBQW1EO0FBQ25ELGdFQUF1QztBQUd2QyxJQUFJLEtBQUssR0FBRyxlQUFLLENBQUMsK0JBQStCLENBQUMsQ0FBQTtBQUNsRCxJQUFJLElBQUksR0FBRyxlQUFLLENBQUMsOEJBQThCLENBQUMsQ0FBQTtBQUNoRCxJQUFJLElBQUksR0FBRyxJQUFJLG9CQUFTLEVBQUUsQ0FBQTtBQStCMUIsSUFBSSxhQUFhLEdBQWdCO0lBQy9CLGFBQWEsRUFBRSxTQUFTO0lBQ3hCLE9BQU8sRUFBRSxVQUFVO0lBQ25CLDBCQUEwQixFQUFFLFNBQVM7SUFDckMsS0FBSyxFQUFFLFNBQVM7SUFDaEIsUUFBUSxFQUFFLEtBQUs7SUFDZixRQUFRLEVBQUUsS0FBSztJQUNmLFdBQVcsRUFBRSxTQUFTO0lBQ3RCLFVBQVUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRTtJQUN2QyxVQUFVLEVBQUUsS0FBSztJQUNqQixXQUFXLEVBQUUsS0FBSztJQUNsQixRQUFRLEVBQUUsS0FBSztJQUNmLGFBQWEsRUFBRSxJQUFJO0lBQ25CLHdCQUF3QixFQUFFLEVBQUUsR0FBRyxJQUFJO0lBQ25DLFVBQVUsRUFBRSxFQUFFO0lBQ2QsYUFBYSxFQUFFLEtBQUs7SUFDcEIsU0FBUyxFQUNQLDBIQUEwSDtJQUM1SCxJQUFJLEVBQUUsRUFBRTtJQUNSLEtBQUssRUFBRSxFQUFFO0lBQ1QsV0FBVyxFQUFFLElBQUk7Q0FDbEIsQ0FBQTtBQU1ELElBQUksTUFBTSxHQUFXO0lBQ25CLE9BQU8sRUFBRSxFQUFFLEdBQUcsYUFBYSxFQUFFO0NBQzlCLENBQUE7QUFFRCxLQUFLLFVBQVUsU0FBUyxDQUFDLEtBQVUs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