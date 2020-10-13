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
        if (config[instanceName].browserHandle) {
            return config[instanceName].browserHandle;
        }
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
        if (config[instanceName].userDataDir) {
            config[instanceName].browserHandle = await playwright_1.default[config[instanceName].browser].launchPersistentContext(config[instanceName].userDataDir, {
                acceptDownloads: true,
                colorScheme: "dark",
                ...launchOption,
            });
        }
        else {
            let browser = await playwright_1.default[config[instanceName].browser].launch(launchOption);
            let contextOption = {
                ignoreHTTPSErrors: true,
                acceptDownloads: true,
                bypassCSP: true,
                userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36",
                colorScheme: "dark",
            };
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