"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_core_1 = __importDefault(require("puppeteer-core"));
const chrome_paths_1 = __importDefault(require("chrome-paths"));
const async_lock_1 = __importDefault(require("async-lock"));
const consoleMessage_1 = __importDefault(require("../consoleMessage"));
const pageStealth_1 = __importDefault(require("./pageStealth"));
const functionToInject_1 = __importDefault(require("../functionToInject"));
let lock = new async_lock_1.default();
let defaultConfig = {
    browserHandle: null,
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
        launchOptions.executablePath = chrome_paths_1.default.chrome;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZmFzdFBhZ2UvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxvRUFBc0M7QUFDdEMsZ0VBQXNDO0FBRXRDLDREQUFrQztBQUVsQyx1RUFBOEM7QUFDOUMsZ0VBQXVDO0FBQ3ZDLDJFQUFtRDtBQUVuRCxJQUFJLElBQUksR0FBRyxJQUFJLG9CQUFTLEVBQUUsQ0FBQTtBQUUxQixJQUFJLGFBQWEsR0FBRztJQUNsQixhQUFhLEVBQUUsSUFBSTtJQUNuQixLQUFLLEVBQUUsSUFBSTtJQUNYLFFBQVEsRUFBRSxLQUFLO0lBQ2YsV0FBVyxFQUFFLElBQUk7SUFDakIsVUFBVSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFO0lBQ3ZDLFVBQVUsRUFBRSxLQUFLO0lBQ2pCLFdBQVcsRUFBRSxLQUFLO0lBQ2xCLFFBQVEsRUFBRSxLQUFLO0lBQ2Ysd0JBQXdCLEVBQUUsRUFBRSxHQUFHLElBQUk7SUFDbkMsVUFBVSxFQUFFLEVBQUU7SUFDZCxhQUFhLEVBQUUsS0FBSztJQUNwQixJQUFJLEVBQUUsRUFBRTtJQUNSLEtBQUssRUFBRSxFQUFFO0NBQ1YsQ0FBQTtBQU1ELElBQUksTUFBTSxHQUFXO0lBQ25CLE9BQU8sRUFBRSxFQUFFLEdBQUcsYUFBYSxFQUFFO0NBQzlCLENBQUE7QUFFRCxLQUFLLFVBQVUsU0FBUyxDQUFDLEtBQVUsRUFBRSxJQUFZLEVBQUUsR0FBRyxJQUFTO0lBQzdELEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFNLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFNLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUE7QUFDOUYsQ0FBQztBQUVE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