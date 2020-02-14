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
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36",
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
        if (config[instanceName].userDataDir) {
            args.push(`---user-data-dir=${config[instanceName].userDataDir}`);
        }
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
    await page.setUserAgent(instanceConfig.userAgent);
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
        setUserAgent: (value) => {
            info("Fast Page", "Setting user agent in  ", value);
            config[instanceName].userAgent = value;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZmFzdFBhZ2UvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxvRUFBc0M7QUFDdEMsZ0VBQXNDO0FBRXRDLDREQUFrQztBQUVsQyxnRUFBdUM7QUFDdkMsMkVBQW1EO0FBQ25ELGtEQUF5QjtBQUV6QixJQUFJLEtBQUssR0FBRyxlQUFLLENBQUMsK0JBQStCLENBQUMsQ0FBQTtBQUNsRCxJQUFJLElBQUksR0FBRyxlQUFLLENBQUMsOEJBQThCLENBQUMsQ0FBQTtBQUNoRCxJQUFJLElBQUksR0FBRyxJQUFJLG9CQUFTLEVBQUUsQ0FBQTtBQUUxQixJQUFJLGFBQWEsR0FBRztJQUNsQixhQUFhLEVBQUUsSUFBSTtJQUNuQixjQUFjLEVBQUUsUUFBUTtJQUN4QixLQUFLLEVBQUUsSUFBSTtJQUNYLFFBQVEsRUFBRSxLQUFLO0lBQ2YsV0FBVyxFQUFFLElBQUk7SUFDakIsVUFBVSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFO0lBQ3ZDLFVBQVUsRUFBRSxLQUFLO0lBQ2pCLFdBQVcsRUFBRSxLQUFLO0lBQ2xCLFFBQVEsRUFBRSxLQUFLO0lBQ2Ysd0JBQXdCLEVBQUUsRUFBRSxHQUFHLElBQUk7SUFDbkMsVUFBVSxFQUFFLEVBQUU7SUFDZCxhQUFhLEVBQUUsS0FBSztJQUNwQixTQUFTLEVBQ1AsMEhBQTBIO0lBQzVILElBQUksRUFBRSxFQUFFO0lBQ1IsS0FBSyxFQUFFLEVBQUU7Q0FDVixDQUFBO0FBTUQsSUFBSSxNQUFNLEdBQVc7SUFDbkIsT0FBTyxFQUFFLEVBQUUsR0FBRyxhQUFhLEVBQUU7Q0FDOUIsQ0FBQTtBQUVELEtBQUssVUFBVSxTQUFTLENBQUMsS0FBVSxFQUFFLElBQVksRUFBRSxHQUFHLElBQVM7SUFDN0QsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQU0sRUFBRSxFQUFFLENBQUMs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