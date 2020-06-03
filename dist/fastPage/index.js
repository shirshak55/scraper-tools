"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fastPage = exports.makePageFaster = void 0;
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
    devtools: false,
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
        let launchOptions = {
            userDataDir: config[instanceName].userDataDir,
            headless: config[instanceName].headless,
            args,
            ignoreDefaultArgs: ["--enable-automation"],
            defaultViewport: null,
            ignoreHTTPSErrors: true,
        };
        if (config[instanceName].defaultBrowser === "chrome") {
            launchOptions.executablePath = chrome_paths_1.default.chrome;
        }
        if (config[instanceName].defaultBrowser === "edge") {
            throw "Edge not supported yet";
        }
        launchOptions.devtools = config[instanceName].devtools;
        config[instanceName].browserHandle = await puppeteer_core_1.default.launch(launchOptions);
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
    await page.setDefaultNavigationTimeout(instanceConfig.defaultNavigationTimeout);
    await page.setDefaultTimeout(instanceConfig.defaultNavigationTimeout);
    const session = await page.target().createCDPSession();
    await page.setBypassCSP(true);
    await page.setUserAgent(instanceConfig.userAgent);
    await pageStealth_1.default(page);
    await page.addScriptTag({
        content: `${functionToInject_1.default.waitForElement} ${functionToInject_1.default.waitForElementToBeRemoved} ${functionToInject_1.default.delay}`,
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
        },
    };
}
exports.fastPage = fastPage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZmFzdFBhZ2UvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsb0VBQXNEO0FBQ3RELGdFQUFzQztBQUV0Qyw0REFBa0M7QUFFbEMsZ0VBQXVDO0FBQ3ZDLDJFQUFtRDtBQUNuRCxrREFBeUI7QUFFekIsSUFBSSxLQUFLLEdBQUcsZUFBSyxDQUFDLCtCQUErQixDQUFDLENBQUE7QUFDbEQsSUFBSSxJQUFJLEdBQUcsZUFBSyxDQUFDLDhCQUE4QixDQUFDLENBQUE7QUFDaEQsSUFBSSxJQUFJLEdBQUcsSUFBSSxvQkFBUyxFQUFFLENBQUE7QUFFMUIsSUFBSSxhQUFhLEdBQUc7SUFDbEIsYUFBYSxFQUFFLElBQUk7SUFDbkIsY0FBYyxFQUFFLFFBQVE7SUFDeEIsS0FBSyxFQUFFLElBQUk7SUFDWCxRQUFRLEVBQUUsS0FBSztJQUNmLFFBQVEsRUFBRSxLQUFLO0lBQ2YsV0FBVyxFQUFFLElBQUk7SUFDakIsVUFBVSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFO0lBQ3ZDLFVBQVUsRUFBRSxLQUFLO0lBQ2pCLFdBQVcsRUFBRSxLQUFLO0lBQ2xCLFFBQVEsRUFBRSxLQUFLO0lBQ2Ysd0JBQXdCLEVBQUUsRUFBRSxHQUFHLElBQUk7SUFDbkMsVUFBVSxFQUFFLEVBQUU7SUFDZCxhQUFhLEVBQUUsS0FBSztJQUNwQixTQUFTLEVBQ1AsMEhBQTBIO0lBQzVILElBQUksRUFBRSxFQUFFO0lBQ1IsS0FBSyxFQUFFLEVBQUU7Q0FDVixDQUFBO0FBTUQsSUFBSSxNQUFNLEdBQVc7SUFDbkIsT0FBTyxFQUFFLEVBQUUsR0FBRyxhQUFhLEVBQUU7Q0FDOUIsQ0FBQTtBQUVELEtBQUssVUFBVSxTQUFTLENBQUMsS0FBVSxFQUFFLElBQVksRUFBRSxHQUFHLElBQVM7SUFDN0QsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFD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