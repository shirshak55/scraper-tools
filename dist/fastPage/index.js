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
    defaultNavigationTimeout: 30 * 1000,
    extensions: [],
    showPageError: false,
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36",
    args: [],
    hooks: [],
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
        if (config[instanceName].proxy) {
            args.push(`--proxy-server=${config[instanceName].proxy}`);
        }
        if (config[instanceName].extensions.length > 0) {
            args.push(`--disable-extensions-except=${config[instanceName].extensions.join(",")}`, `--load-extension=${config[instanceName].extensions.join(",")}`);
        }
        let launchOption = {
            headless: config[instanceName].headless,
            args,
            devtools: config[instanceName].devtools,
        };
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
    const session = await page.context().newCDPSession(page);
    await pageStealth_1.default(page);
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
    await session.send("Page.setWebLifecycleState", {
        state: "active",
    });
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
        setDefaultNavigationTimeout: (value) => {
            info("Fast Page", "Default navigation timeout", value);
            config[instanceName].defaultNavigationTimeout = value;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZmFzdFBhZ2UvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsNERBQWtDO0FBQ2xDLGtEQUF5QjtBQUN6Qiw0REFRbUI7QUFDbkIsMkVBQW1EO0FBQ25ELGdFQUF1QztBQUV2QyxJQUFJLEtBQUssR0FBRyxlQUFLLENBQUMsK0JBQStCLENBQUMsQ0FBQTtBQUNsRCxJQUFJLElBQUksR0FBRyxlQUFLLENBQUMsOEJBQThCLENBQUMsQ0FBQTtBQUNoRCxJQUFJLElBQUksR0FBRyxJQUFJLG9CQUFTLEVBQUUsQ0FBQTtBQXFCMUIsSUFBSSxhQUFhLEdBQWdCO0lBQy9CLGFBQWEsRUFBRSxTQUFTO0lBQ3hCLE9BQU8sRUFBRSxVQUFVO0lBQ25CLEtBQUssRUFBRSxTQUFTO0lBQ2hCLFFBQVEsRUFBRSxLQUFLO0lBQ2YsUUFBUSxFQUFFLEtBQUs7SUFDZixXQUFXLEVBQUUsU0FBUztJQUN0QixVQUFVLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUU7SUFDdkMsVUFBVSxFQUFFLEtBQUs7SUFDakIsV0FBVyxFQUFFLEtBQUs7SUFDbEIsUUFBUSxFQUFFLEtBQUs7SUFDZix3QkFBd0IsRUFBRSxFQUFFLEdBQUcsSUFBSTtJQUNuQyxVQUFVLEVBQUUsRUFBRTtJQUNkLGFBQWEsRUFBRSxLQUFLO0lBQ3BCLFNBQVMsRUFDUCwwSEFBMEg7SUFDNUgsSUFBSSxFQUFFLEVBQUU7SUFDUixLQUFLLEVBQUUsRUFBRTtDQUNWLENBQUE7QUFNRCxJQUFJLE1BQU0sR0FBVztJQUNuQixPQUFPLEVBQUUsRUFBRSxHQUFHLGFBQWEsRUFBRTtDQUM5QixDQUFBO0FBRUQsS0FBSyxVQUFVLFNBQVMsQ0FBQyxLQUFVLEVBQUUsSUFBWSxFQUFFLEdBQUcsSUFBUztJQUM3RCxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBTSxFQUFF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