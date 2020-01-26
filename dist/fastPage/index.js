"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_core_1 = __importDefault(require("puppeteer-core"));
const chrome_paths_1 = __importDefault(require("chrome-paths"));
const edge_paths_1 = __importDefault(require("edge-paths"));
const async_lock_1 = __importDefault(require("async-lock"));
const consoleMessage_1 = __importDefault(require("../consoleMessage"));
const pageStealth_1 = __importDefault(require("./pageStealth"));
const functionToInject_1 = __importDefault(require("../functionToInject"));
let lock = new async_lock_1.default();
let defaultConfig = {
    browserHandle: null,
    defaultBrowser: "chrome",
    proxy: null,
    headless: false,
    userDataDir: null,
    windowSize: { width: 595, height: 842 },
    blockFonts: false,
    blockImages: false,
    blockCSS: false,
    defaultNavigationTimeout: 30 * 1000,
    extensions: [],
    showPageError: false,
    args: [],
    hooks: []
};
let config = {
    default: { ...defaultConfig }
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
            `--window-size=${config[instanceName].windowSize.width},${config[instanceName].windowSize.height}`,
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-web-security",
            "--disable-features=site-per-process",
            "--ignore-certificate-errors",
            "--enable-features=NetworkService",
            "--allow-running-insecure-content",
            "--enable-automation",
            "--disable-background-timer-throttling",
            "--disable-backgrounding-occluded-windows",
            "--disable-renderer-backgrounding",
            ...config[instanceName].args
        ];
        if (config[instanceName].proxy) {
            args.push(`--proxy-server=${config[instanceName].proxy}`);
        }
        if (config[instanceName].extensions.length > 0) {
            args.push(`--disable-extensions-except=${config[instanceName].extensions.join(",")}`, `--load-extension=${config[instanceName].extensions.join(",")}`);
        }
        let launchOptions = {
            userDataDir: config[instanceName].userDataDir,
            headless: config[instanceName].headless,
            args,
            ignoreDefaultArgs: ["--enable-automation"],
            defaultViewport: null,
            ignoreHTTPSErrors: true
        };
        if (config[instanceName].defaultBrowser === "chrome") {
            launchOptions.executablePath = chrome_paths_1.default.chrome;
        }
        if (config[instanceName].defaultBrowser === "edge") {
            launchOptions.executablePath = edge_paths_1.default.edge;
        }
        config[instanceName].browserHandle = await puppeteer_core_1.default.launch(launchOptions);
        return config[instanceName].browserHandle;
    })
        .catch((err) => console.log("Error on starting new page: Lock Error ->", err));
}
async function makePageFaster(page, instanceName) {
    let instanceConfig = config[instanceName];
    await loadHooks(instanceConfig["hooks"], "make_page_faster", page);
    await page.setDefaultNavigationTimeout(instanceConfig.defaultNavigationTimeout);
    await page.setDefaultTimeout(instanceConfig.defaultNavigationTimeout);
    const session = await page.target().createCDPSession();
    await page.setBypassCSP(true);
    await pageStealth_1.default(page);
    await page.addScriptTag({
        content: `${functionToInject_1.default.waitForElement} ${functionToInject_1.default.waitForElementToBeRemoved} ${functionToInject_1.default.delay}`
    });
    if (instanceConfig.showPageError === true) {
        page.on("error", (err) => {
            consoleMessage_1.default.error("Error happen at the page: ", err);
        });
        page.on("pageerror", (pageerr) => {
            consoleMessage_1.default.error("Page Error occurred: ", pageerr);
        });
    }
    if (instanceConfig.blockCSS || instanceConfig.blockFonts || instanceConfig.blockImages) {
        await page.setRequestInterception(true);
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
    await session.send("Page.enable");
    await session.send("Page.setWebLifecycleState", {
        state: "active"
    });
    return page;
}
exports.default = (instanceName = "default") => {
    return {
        init: async (useCurrentDefaultConfig = true) => {
            if (useCurrentDefaultConfig) {
                config[instanceName] = { ...config.default };
            }
            else {
                config[instanceName] = { ...defaultConfig };
            }
        },
        getBrowserHandle: async () => {
            return await browser(instanceName);
        },
        newPage: async () => {
            consoleMessage_1.default.info("Fast Page", "Launching new page ");
            let brow = await browser(instanceName);
            let page = await brow.newPage();
            await makePageFaster(page, instanceName);
            return page;
        },
        closeBrowser: async () => {
            consoleMessage_1.default.info("Fast Page", "Requesting to close browser ");
            return await lock
                .acquire("instance_close_" + instanceName, async function () {
                if (config[instanceName].browserHandle) {
                    let bHandle = await browser(instanceName);
                    await bHandle.close();
                }
                config[instanceName].browserHandle = null;
                return "closed";
            })
                .catch((err) => console.log("Error on closing browser: Lock Error ->", err));
        },
        setProxy: (value) => {
            consoleMessage_1.default.info("Fast Page", "Setting proxy to ", value);
            config[instanceName].proxy = value;
        },
        setDefaultBrowser: (name) => {
            if (name !== "chrome" && name !== "edge") {
                throw "Browser not support.";
            }
            config[instanceName].defaultBrowser = name;
        },
        setShowPageError: (value) => {
            consoleMessage_1.default.info("Fast Page", "Setting show page error to ", value);
            config[instanceName].showPageError = value;
        },
        setHeadless: (value = false) => {
            consoleMessage_1.default.info("Fast Page", "Setting headless to ", value);
            config[instanceName].headless = value;
        },
        setUserDataDir: (value) => {
            consoleMessage_1.default.info("Fast Page", "Storing chrome cache in  ", value);
            config[instanceName].userDataDir = value;
        },
        setWindowSizeArg: (value) => {
            consoleMessage_1.default.info("Fast Page", "Setting window size to ", value);
            config[instanceName].windowSize = value;
        },
        set2captchaToken: (value) => {
            consoleMessage_1.default.info("Fast Page", "Setting 2captcha token to ", value);
            config[instanceName].twoCaptchaToken = value;
        },
        setExtensionsPaths: (value) => {
            config[instanceName].extensions = value;
        },
        setDefaultNavigationTimeout: (value) => {
            consoleMessage_1.default.info("Fast Page", "Default navigation timeout", value);
            config[instanceName].defaultNavigationTimeout = value;
        },
        blockImages: (value = true) => {
            consoleMessage_1.default.info("Fast Page", "Block Image", value);
            config[instanceName].blockImages = value;
        },
        blockFonts: (value = true) => {
            consoleMessage_1.default.info("Fast Page", "Block Font", value);
            config[instanceName].blockFonts = value;
        },
        blockCSS: (value = true) => {
            consoleMessage_1.default.info("Fast Page", "Block CSS", value);
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
        }
    };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZmFzdFBhZ2UvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxvRUFBc0M7QUFDdEMsZ0VBQXNDO0FBQ3RDLDREQUFrQztBQUVsQyw0REFBa0M7QUFFbEMsdUVBQThDO0FBQzlDLGdFQUF1QztBQUN2QywyRUFBbUQ7QUFFbkQsSUFBSSxJQUFJLEdBQUcsSUFBSSxvQkFBUyxFQUFFLENBQUE7QUFFMUIsSUFBSSxhQUFhLEdBQUc7SUFDbEIsYUFBYSxFQUFFLElBQUk7SUFDbkIsY0FBYyxFQUFFLFFBQVE7SUFDeEIsS0FBSyxFQUFFLElBQUk7SUFDWCxRQUFRLEVBQUUsS0FBSztJQUNmLFdBQVcsRUFBRSxJQUFJO0lBQ2pCLFVBQVUsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRTtJQUN2QyxVQUFVLEVBQUUsS0FBSztJQUNqQixXQUFXLEVBQUUsS0FBSztJQUNsQixRQUFRLEVBQUUsS0FBSztJQUNmLHdCQUF3QixFQUFFLEVBQUUsR0FBRyxJQUFJO0lBQ25DLFVBQVUsRUFBRSxFQUFFO0lBQ2QsYUFBYSxFQUFFLEtBQUs7SUFDcEIsSUFBSSxFQUFFLEVBQUU7SUFDUixLQUFLLEVBQUUsRUFBRTtDQUNWLENBQUE7QUFNRCxJQUFJLE1BQU0sR0FBVztJQUNuQixPQUFPLEVBQUUsRUFBRSxHQUFHLGFBQWEsRUFBRTtDQUM5QixDQUFBO0FBRUQsS0FBSyxVQUFVLFNBQVMsQ0FBQyxLQUFVLEVBQUUsSUFBWSxFQUFFLEdBQUcsSUFBUztJQUM3RCxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBTSxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxJ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