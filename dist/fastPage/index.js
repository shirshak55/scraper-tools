"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_core_1 = __importDefault(require("puppeteer-core"));
const chrome_paths_1 = __importDefault(require("chrome-paths"));
const async_lock_1 = __importDefault(require("async-lock"));
const pageStealth_1 = __importDefault(require("./pageStealth"));
const functionToInject_1 = __importDefault(require("../functionToInject"));
const debug_1 = __importDefault(require("debug"));
let error = debug_1.default("scrapper_tools:fastpage:error");
let info = debug_1.default("scrapper_tools:fastpage:info");
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
            throw "Edge not supported yet";
        }
        config[instanceName].browserHandle = await puppeteer_core_1.default.launch(launchOptions);
        return config[instanceName].browserHandle;
    })
        .catch((err) => error("Error on starting new page: Lock Error ->", err));
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
            error("Error happen at the page: ", err);
        });
        page.on("pageerror", (pageerr) => {
            error("Page Error occurred: ", pageerr);
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
            info("Fast Page", "Launching new page ");
            let brow = await browser(instanceName);
            let page = await brow.newPage();
            await makePageFaster(page, instanceName);
            return page;
        },
        closeBrowser: async () => {
            info("Fast Page", "Requesting to close browser ");
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
            info("Fast Page", "Setting proxy to ", value);
            config[instanceName].proxy = value;
        },
        setDefaultBrowser: (name) => {
            if (name !== "chrome" && name !== "edge") {
                throw "Browser not support.";
            }
            config[instanceName].defaultBrowser = name;
        },
        setShowPageError: (value) => {
            info("Fast Page", "Setting show page error to ", value);
            config[instanceName].showPageError = value;
        },
        setHeadless: (value = false) => {
            info("Fast Page", "Setting headless to ", value);
            config[instanceName].headless = value;
        },
        setUserDataDir: (value) => {
            info("Fast Page", "Storing chrome cache in  ", value);
            config[instanceName].userDataDir = value;
        },
        setWindowSizeArg: (value) => {
            info("Fast Page", "Setting window size to ", value);
            config[instanceName].windowSize = value;
        },
        set2captchaToken: (value) => {
            info("Fast Page", "Setting 2captcha token to ", value);
            config[instanceName].twoCaptchaToken = value;
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
        }
    };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZmFzdFBhZ2UvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxvRUFBc0M7QUFDdEMsZ0VBQXNDO0FBRXRDLDREQUFrQztBQUVsQyxnRUFBdUM7QUFDdkMsMkVBQW1EO0FBQ25ELGtEQUF5QjtBQUV6QixJQUFJLEtBQUssR0FBRyxlQUFLLENBQUMsK0JBQStCLENBQUMsQ0FBQTtBQUNsRCxJQUFJLElBQUksR0FBRyxlQUFLLENBQUMsOEJBQThCLENBQUMsQ0FBQTtBQUNoRCxJQUFJLElBQUksR0FBRyxJQUFJLG9CQUFTLEVBQUUsQ0FBQTtBQUUxQixJQUFJLGFBQWEsR0FBRztJQUNsQixhQUFhLEVBQUUsSUFBSTtJQUNuQixjQUFjLEVBQUUsUUFBUTtJQUN4QixLQUFLLEVBQUUsSUFBSTtJQUNYLFFBQVEsRUFBRSxLQUFLO0lBQ2YsV0FBVyxFQUFFLElBQUk7SUFDakIsVUFBVSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFO0lBQ3ZDLFVBQVUsRUFBRSxLQUFLO0lBQ2pCLFdBQVcsRUFBRSxLQUFLO0lBQ2xCLFFBQVEsRUFBRSxLQUFLO0lBQ2Ysd0JBQXdCLEVBQUUsRUFBRSxHQUFHLElBQUk7SUFDbkMsVUFBVSxFQUFFLEVBQUU7SUFDZCxhQUFhLEVBQUUsS0FBSztJQUNwQixJQUFJLEVBQUUsRUFBRTtJQUNSLEtBQUssRUFBRSxFQUFFO0NBQ1YsQ0FBQTtBQU1ELElBQUksTUFBTSxHQUFXO0lBQ25CLE9BQU8sRUFBRSxFQUFFLEdBQUcsYUFBYSxFQUFFO0NBQzlCLENBQUE7QUFFRCxLQUFLLFVBQVUsU0FBUyxDQUFDLEtBQVUsRUFBRSxJQUFZLEVBQUUsR0FBRyxJQUFTO0lBQzdELEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFNLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssSUFB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