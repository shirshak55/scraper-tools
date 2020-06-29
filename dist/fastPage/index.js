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
            config[instanceName].browserHandle = await playwright_1.default[config[instanceName].browser].launchPersistentContext(config[instanceName].userDataDir, launchOption);
        }
        else {
            let browser = await playwright_1.default[config[instanceName].browser].launch(launchOption);
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
                if (config[instanceName].browserHandle) {
                    let bHandle = await browser(instanceName);
                    await bHandle.close();
                }
                config[instanceName].browserHandle = undefined;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZmFzdFBhZ2UvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsNERBQWtDO0FBQ2xDLGtEQUF5QjtBQUN6Qiw0REFRbUI7QUFDbkIsMkVBQW1EO0FBQ25ELGdFQUF1QztBQUd2QyxJQUFJLEtBQUssR0FBRyxlQUFLLENBQUMsK0JBQStCLENBQUMsQ0FBQTtBQUNsRCxJQUFJLElBQUksR0FBRyxlQUFLLENBQUMsOEJBQThCLENBQUMsQ0FBQTtBQUNoRCxJQUFJLElBQUksR0FBRyxJQUFJLG9CQUFTLEVBQUUsQ0FBQTtBQThCMUIsSUFBSSxhQUFhLEdBQWdCO0lBQy9CLGFBQWEsRUFBRSxTQUFTO0lBQ3hCLE9BQU8sRUFBRSxVQUFVO0lBQ25CLEtBQUssRUFBRSxTQUFTO0lBQ2hCLFFBQVEsRUFBRSxLQUFLO0lBQ2YsUUFBUSxFQUFFLEtBQUs7SUFDZixXQUFXLEVBQUUsU0FBUztJQUN0QixVQUFVLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUU7SUFDdkMsVUFBVSxFQUFFLEtBQUs7SUFDakIsV0FBVyxFQUFFLEtBQUs7SUFDbEIsUUFBUSxFQUFFLEtBQUs7SUFDZixhQUFhLEVBQUUsSUFBSTtJQUNuQix3QkFBd0IsRUFBRSxFQUFFLEdBQUcsSUFBSTtJQUNuQyxVQUFVLEVBQUUsRUFBRTtJQUNkLGFBQWEsRUFBRSxLQUFLO0lBQ3BCLFNBQVMsRUFDUCwwSEFBMEg7SUFDNUgsSUFBSSxFQUFFLEVBQUU7SUFDUixLQUFLLEVBQUUsRUFBRTtJQUNULFdBQVcsRUFBRSxJQUFJO0NBQ2xCLENBQUE7QUFNRCxJQUFJLE1BQU0sR0FBVztJQUNuQixPQUFPLEVBQUUsRUFBRSxHQUFHLGFBQWEsRUFBRTtDQUM5QixDQUFBO0FBRUQsS0FBSyxVQUFVLFNBQVMsQ0FBQyxLQUFVLEVBQUUsSUFBWSxFQUFFLEdBQUcsSUFB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