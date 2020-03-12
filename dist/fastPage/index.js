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
        launchOptions.devtools = config[instanceName].devtools;
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
    return { session, page };
}
exports.makePageFaster = makePageFaster;
function fastPage(instanceName = "default") {
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
        }
    };
}
exports.fastPage = fastPage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZmFzdFBhZ2UvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxvRUFBc0Q7QUFDdEQsZ0VBQXNDO0FBRXRDLDREQUFrQztBQUVsQyxnRUFBdUM7QUFDdkMsMkVBQW1EO0FBQ25ELGtEQUF5QjtBQUV6QixJQUFJLEtBQUssR0FBRyxlQUFLLENBQUMsK0JBQStCLENBQUMsQ0FBQTtBQUNsRCxJQUFJLElBQUksR0FBRyxlQUFLLENBQUMsOEJBQThCLENBQUMsQ0FBQTtBQUNoRCxJQUFJLElBQUksR0FBRyxJQUFJLG9CQUFTLEVBQUUsQ0FBQTtBQUUxQixJQUFJLGFBQWEsR0FBRztJQUNsQixhQUFhLEVBQUUsSUFBSTtJQUNuQixjQUFjLEVBQUUsUUFBUTtJQUN4QixLQUFLLEVBQUUsSUFBSTtJQUNYLFFBQVEsRUFBRSxLQUFLO0lBQ2YsUUFBUSxFQUFFLEtBQUs7SUFDZixXQUFXLEVBQUUsSUFBSTtJQUNqQixVQUFVLEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUU7SUFDdkMsVUFBVSxFQUFFLEtBQUs7SUFDakIsV0FBVyxFQUFFLEtBQUs7SUFDbEIsUUFBUSxFQUFFLEtBQUs7SUFDZix3QkFBd0IsRUFBRSxFQUFFLEdBQUcsSUFBSTtJQUNuQyxVQUFVLEVBQUUsRUFBRTtJQUNkLGFBQWEsRUFBRSxLQUFLO0lBQ3BCLFNBQVMsRUFDUCwwSEFBMEg7SUFDNUgsSUFBSSxFQUFFLEVBQUU7SUFDUixLQUFLLEVBQUUsRUFBRTtDQUNWLENBQUE7QUFNRCxJQUFJLE1BQU0sR0FBVztJQUNuQixPQUFPLEVBQUUsRUFBRSxHQUFHLGFBQWEsRUFBRTtDQUM5QixDQUFBO0FBRUQsS0FBSyxVQUFVLFNBQVMsQ0FBQyxLQUFVLEVBQUUsSUFBWSxFQUFFLEdBQUcsSUFBUztJQUM3RCxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBTSxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFBO0FBQzlGLENBQUM7QUFFRCxLQUFLLFVBQVUsT0FBTyxDQUFDLFlBQW9CO0lBQ3pDLE9BQU8sTUFBTSxJQUFJO1NBQ2QsT0FBTyxDQUFDLFdBQVcsR0FBRyxZQUFZLEVBQUUsS0FBSztRQUN4QyxJQUFJLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxhQUFhO1lBQUUsT0FBTyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsYUFBYSxDQUFBO1FBRWpGLElBQUksSUFBSSxHQUFHO1lBQ1QsY0FBYztZQUNkLGlCQUFpQixNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsVUFBVSxDQUFDLEtBQUssSUFBSSxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRTtZQUNsRyxxQ0FBcUM7WUFDckMsa0NBQWtDO1lBQ2xDLGtDQUFrQztZQUNsQyxxQkFBcUI7WUFDckIsdUNBQXVDO1lBQ3ZDLDBDQUEwQztZQUMxQyxrQ0FBa0M7WUFDbEMsd0JBQXdCO1lBQ3hCLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLElBQUk7U0FDN0IsQ0FBQTtRQUVELElBQUksTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLFdBQVcsRUFBRTtZQUNwQyxJQUFJLENBQUMsSUFBSSxDQUFDLG9CQUFvQixNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQTtTQUNsRTtRQUVELElBQUksTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLEtBQUssRUFBRTtZQUM5QixJQUFJLENBQUMsSUFBSSxDQUFDLGtCQUFrQixNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQTtTQUMxRDtRQUVELElBQUksTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQzlDLElBQUksQ0FBQyxJQUFJLENBQ1AsK0JBQStCLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQzFFLG9CQUFvQixNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUNoRSxDQUFBO1NBQ0Y7UUFFRCxJQUFJLGFBQWEsR0FBUTtZQUN2QixXQUFXLEVBQUUsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLFdBQVc7WUFDN0MsUUFBUSxFQUFFLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxRQUFRO1lBQ3ZDLElBQUk7WUFDSixpQkFBaUIsRUFBRSxDQUFDLHFCQUFxQixDQUFDO1lBQzFDLGVBQWUsRUFBRSxJQUFJO1lBQ3JCLGlCQUFpQixFQUFFLElBQUk7U0FDeEIsQ0FBQTtRQUVELElBQUksTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLGNBQWMsS0FBSyxRQUFRLEVBQUU7WUFDcEQsYUFBYSxDQUFDLGNBQWMsR0FBRyxzQkFBVyxDQUFDLE1BQU0sQ0FBQTtTQUNsRDtRQUNELElBQUksTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLGNBQWMsS0FBSyxNQUFNLEVBQUU7WUFDbEQsTUFBTSx3QkFBd0IsQ0FBQTtTQUMvQjtRQUVELGFBQWEsQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLFFBQVEsQ0FBQTtRQUV0RCxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsYUFBYSxHQUFHLE1BQU0sd0JBQVMsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUE7UUFDMUUsT0FBTyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsYUFBYSxDQUFBO0lBQzNDLENBQUMsQ0FBQztTQUNELEtBQUssQ0FBQyxDQUFDLEdBQVEsRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLDJDQUEyQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUE7QUFDakYsQ0FBQztBQUVNLEtBQUssVUFBVSxjQUFjLENBQ2xDLElBQVUsRUFDVixZQUFvQjtJQUVwQixJQUFJLGNBQWMsR0FBeUIsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFBO0lBQy9ELE1BQU0sU0FBUyxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsRUFBRSxrQkFBa0IsRUFBRSxJQUFJLENBQUMsQ0FBQTtJQUNsRSxNQUFNLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxjQUFjLENBQUMsd0JBQXdCLENBQUMsQ0FBQTtJQUMvRSxNQUFNLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxjQUFjLENBQUMsd0JBQXdCLENBQUMsQ0FBQTtJQUVyRSxNQUFNLE9BQU8sR0FBRyxNQUFNLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFBO0lBQ3RELE1BQU0sSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUU3QixNQUFNLElBQUksQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFBO0lBQ2pELE1BQU0scUJBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUV2QixNQUFNLElBQUksQ0FBQyxZQUFZLENBQUM7UUFDdEIsT0FBTyxFQUFFLEdBQUcsMEJBQWlCLENBQUMsY0FBYyxJQUFJLDBCQUFpQixDQUFDLHlCQUF5QixJQUFJLDBCQUFpQixDQUFDLEtBQUssRUFBRTtLQUN6SCxDQUFDLENBQUE7SUFFRixJQUFJLGNBQWMsQ0FBQyxhQUFhLEtBQUssSUFBSSxFQUFFO1FBQ3pDLElBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsR0FBUSxFQUFFLEVBQUU7WUFDNUIsS0FBSyxDQUFDLDRCQUE0QixFQUFFLEdBQUcsQ0FBQyxDQUFBO1FBQzFDLENBQUMsQ0FBQyxDQUFBO1FBQ0YsSUFBSSxDQUFDLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxPQUFZLEVBQUUsRUFBRTtZQUNwQyxLQUFLLENBQUMsdUJBQXVCLEVBQUUsT0FBTyxDQUFDLENBQUE7UUFDekMsQ0FBQyxDQUFDLENBQUE7S0FDSDtJQUNELElBQUksY0FBYyxDQUFDLFFBQVEsSUFBSSxjQUFjLENBQUMsVUFBVSxJQUFJLGNBQWMsQ0FBQyxXQUFXLEVBQUU7UUFDdEYsTUFBTSxJQUFJLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDdkMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxPQUFZLEVBQUUsRUFBRTtZQUNsQyxJQUNFLENBQUMsY0FBYyxDQUFDLFdBQVcsSUFBSSxPQUFPLENBQUMsWUFBWSxFQUFFLEtBQUssT0FBTyxDQUFDO2dCQUNsRSxDQUFDLGNBQWMsQ0FBQyxVQUFVLElBQUksT0FBTyxDQUFDLFlBQVksRUFBRSxLQUFLLE1BQU0sQ0FBQztnQkFDaEUsQ0FBQyxjQUFjLENBQUMsUUFBUSxJQUFJLE9BQU8sQ0FBQyxZQUFZLEVBQUUsS0FBSyxZQUFZLENBQUMsRUFDcEU7Z0JBQ0EsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFBO2FBQ2hCO2lCQUFNO2dCQUNMLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQTthQUNuQjtRQUNILENBQUMsQ0FBQyxDQUFBO0tBQ0g7SUFFRCxNQUFNLE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUE7SUFDakMsTUFBTSxPQUFPLENBQUMsSUFBSSxDQUFDLDJCQUEyQixFQUFFO1FBQzlDLEtBQUssRUFBRSxRQUFRO0tBQ2hCLENBQUMsQ0FBQTtJQUVGLE9BQU8sRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUE7QUFDMUIsQ0FBQztBQWhERCx3Q0FnREM7QUFFRCxTQUFnQixRQUFRLENBQUMsWUFBWSxHQUFHLFNBQVM7SUFDL0MsT0FBTztRQUNMLElBQUksRUFBRSxLQUFLLEVBQUUsdUJBQXVCLEdBQUcsSUFBSSxFQUFFLEVBQUU7WUFDN0MsSUFBSSx1QkFBdUIsRUFBRTtnQkFDM0IsTUFBTSxDQUFDLFlBQVksQ0FBQyxHQUFHLEVBQUUsR0FBRyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUE7YUFDN0M7aUJBQU07Z0JBQ0wsTUFBTSxDQUFDLFlBQVksQ0FBQyxHQUFHLEVBQUUsR0FBRyxhQUFhLEVBQUUsQ0FBQTthQUM1QztRQUNILENBQUM7UUFFRCxnQkFBZ0IsRUFBRSxLQUFLLElBQXNCLEVBQUU7WUFDN0MsT0FBTyxNQUFNLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQTtRQUNwQyxDQUFDO1FBRUQsT0FBTyxFQUFFLEtBQUssSUFBbUIsRUFBRTtZQUNqQyxJQUFJLENBQUMsV0FBVyxFQUFFLHFCQUFxQixDQUFDLENBQUE7WUFDeEMsSUFBSSxJQUFJLEdBQUcsTUFBTSxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUE7WUFDdEMsSUFBSSxFQUFFLElBQUksRUFBRSxHQUFHLE1BQU0sY0FBYyxDQUFDLE1BQU0sSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFFLFlBQVksQ0FBQyxDQUFBO1lBQ3ZFLE9BQU8sSUFBSSxDQUFBO1FBQ2IsQ0FBQztRQUVELFFBQVEsRUFBRSxLQUFLLElBQWtELEVBQUU7WUFDakUsSUFBSSxDQUFDLFdBQVcsRUFBRSxrQ0FBa0MsQ0FBQyxDQUFBO1lBQ3JELElBQUksSUFBSSxHQUFHLE1BQU0sT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFBO1lBQ3RDLElBQUksRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEdBQUcsTUFBTSxjQUFjLENBQUMsTUFBTSxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUUsWUFBWSxDQUFDLENBQUE7WUFDaEYsT0FBTyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsQ0FBQTtRQUMxQixDQUFDO1FBRUQsWUFBWSxFQUFFLEtBQUssSUFBSSxFQUFFO1lBQ3ZCLElBQUksQ0FBQyxXQUFXLEVBQUUsOEJBQThCLENBQUMsQ0FBQTtZQUNqRCxPQUFPLE1BQU0sSUFBSTtpQkFDZCxPQUFPLENBQUMsaUJBQWlCLEdBQUcsWUFBWSxFQUFFLEtBQUs7Z0JBQzlDLElBQUksTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLGFBQWEsRUFBRTtvQkFDdEMsSUFBSSxPQUFPLEdBQUcsTUFBTSxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUE7b0JBQ3pDLE1BQU0sT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFBO2lCQUN0QjtnQkFDRCxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQTtnQkFDekMsT0FBTyxRQUFRLENBQUE7WUFDakIsQ0FBQyxDQUFDO2lCQUNELEtBQUssQ0FBQyxDQUFDLEdBQVEsRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyx5Q0FBeUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFBO1FBQ3JGLENBQUM7UUFFRCxRQUFRLEVBQUUsQ0FBQyxLQUFhLEVBQUUsRUFBRTtZQUMxQixJQUFJLENBQUMsV0FBVyxFQUFFLG1CQUFtQixFQUFFLEtBQUssQ0FBQyxDQUFBO1lBQzdDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFBO1FBQ3BDLENBQUM7UUFFRCxpQkFBaUIsRUFBRSxDQUFDLElBQXVCLEVBQUUsRUFBRTtZQUM3QyxJQUFJLElBQUksS0FBSyxRQUFRLElBQUksSUFBSSxLQUFLLE1BQU0sRUFBRTtnQkFDeEMsTUFBTSxzQkFBc0IsQ0FBQTthQUM3QjtZQUVELE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFBO1FBQzVDLENBQUM7UUFFRCxnQkFBZ0IsRUFBRSxDQUFDLEtBQWMsRUFBRSxFQUFFO1lBQ25DLElBQUksQ0FBQyxXQUFXLEVBQUUsNkJBQTZCLEVBQUUsS0FBSyxDQUFDLENBQUE7WUFDdkQsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUE7UUFDNUMsQ0FBQztRQUVELFdBQVcsRUFBRSxDQUFDLFFBQWlCLEtBQUssRUFBRSxFQUFFO1lBQ3RDLElBQUksQ0FBQyxXQUFXLEVBQUUsc0JBQXNCLEVBQUUsS0FBSyxDQUFDLENBQUE7WUFDaEQsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUE7UUFDdkMsQ0FBQztRQUVELFdBQVcsRUFBRSxDQUFDLFFBQWlCLElBQUksRUFBRSxFQUFFO1lBQ3JDLElBQUksQ0FBQyxXQUFXLEVBQUUsc0JBQXNCLEVBQUUsS0FBSyxDQUFDLENBQUE7WUFDaEQsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUE7UUFDdkMsQ0FBQztRQUVELGNBQWMsRUFBRSxDQUFDLEtBQWEsRUFBRSxFQUFFO1lBQ2hDLElBQUksQ0FBQyxXQUFXLEVBQUUsMkJBQTJCLEVBQUUsS0FBSyxDQUFDLENBQUE7WUFDckQsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUE7UUFDMUMsQ0FBQztRQUVELFlBQVksRUFBRSxDQUFDLEtBQWEsRUFBRSxFQUFFO1lBQzlCLElBQUksQ0FBQyxXQUFXLEVBQUUseUJBQXlCLEVBQUUsS0FBSyxDQUFDLENBQUE7WUFDbkQsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUE7UUFDeEMsQ0FBQztRQUVELGdCQUFnQixFQUFFLENBQUMsS0FBd0MsRUFBRSxFQUFFO1lBQzdELElBQUksQ0FBQyxXQUFXLEVBQUUseUJBQXlCLEVBQUUsS0FBSyxDQUFDLENBQUE7WUFDbkQsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUE7UUFDekMsQ0FBQztRQUVELGdCQUFnQixFQUFFLENBQUMsS0FBYSxFQUFFLEVBQUU7WUFDbEMsSUFBSSxDQUFDLFdBQVcsRUFBRSw0QkFBNEIsRUFBRSxLQUFLLENBQUMsQ0FBQTtZQUN0RCxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQTtRQUM5QyxDQUFDO1FBRUQsa0JBQWtCLEVBQUUsQ0FBQyxLQUFvQixFQUFFLEVBQUU7WUFDM0MsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUE7UUFDekMsQ0FBQztRQUVELDJCQUEyQixFQUFFLENBQUMsS0FBYSxFQUFFLEVBQUU7WUFDN0MsSUFBSSxDQUFDLFdBQVcsRUFBRSw0QkFBNEIsRUFBRSxLQUFLLENBQUMsQ0FBQTtZQUN0RCxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsd0JBQXdCLEdBQUcsS0FBSyxDQUFBO1FBQ3ZELENBQUM7UUFFRCxXQUFXLEVBQUUsQ0FBQyxRQUFpQixJQUFJLEVBQUUsRUFBRTtZQUNyQyxJQUFJLENBQUMsV0FBVyxFQUFFLGFBQWEsRUFBRSxLQUFLLENBQUMsQ0FBQTtZQUN2QyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQTtRQUMxQyxDQUFDO1FBRUQsVUFBVSxFQUFFLENBQUMsUUFBaUIsSUFBSSxFQUFFLEVBQUU7WUFDcEMsSUFBSSxDQUFDLFdBQVcsRUFBRSxZQUFZLEVBQUUsS0FBSyxDQUFDLENBQUE7WUFDdEMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUE7UUFDekMsQ0FBQztRQUVELFFBQVEsRUFBRSxDQUFDLFFBQWlCLElBQUksRUFBRSxFQUFFO1lBQ2xDLElBQUksQ0FBQyxXQUFXLEVBQUUsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFBO1lBQ3JDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFBO1FBQ3ZDLENBQUM7UUFFRCxTQUFTLENBQUMsZUFBdUIsU0FBUztZQUN4QyxJQUFJLFlBQVksS0FBSyxJQUFJLEVBQUU7Z0JBQ3pCLE9BQU8sTUFBTSxDQUFBO2FBQ2Q7WUFDRCxPQUFPLE1BQU0sQ0FBQyxZQUFZLENBQUE7UUFDNUIsQ0FBQztRQUVELE9BQU8sQ0FBQyxJQUFZLEVBQUUsTUFBZ0I7WUFDcEMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQTtRQUNuRCxDQUFDO1FBRUQsTUFBTSxDQUFDLEdBQVE7WUFDYixNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUNyQyxDQUFDO0tBQ0YsQ0FBQTtBQUNILENBQUM7QUFqSUQsNEJBaUlDIn0=