"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import puppeteer from 'puppeteer-core'
const chrome_paths_1 = __importDefault(require("chrome-paths"));
const puppeteer_extra_1 = __importDefault(require("puppeteer-extra"));
const puppeteer_extra_plugin_stealth_1 = __importDefault(require("puppeteer-extra-plugin-stealth"));
const puppeteer_extra_plugin_anonymize_ua_1 = __importDefault(require("puppeteer-extra-plugin-anonymize-ua"));
const puppeteer_extra_plugin_recaptcha_1 = __importDefault(require("puppeteer-extra-plugin-recaptcha"));
const async_lock_1 = __importDefault(require("async-lock"));
exports.default = (() => {
    let lock = new async_lock_1.default();
    let defaultConfig = {
        browserHandle: null,
        proxy: null,
        headless: false,
        userDataDir: null,
        useChrome: false,
        windowSize: { width: 595, height: 842 },
        blockFonts: false,
        blockImages: false,
        blockCSS: false,
        defaultNavigationTimeout: 30 * 1000,
    };
    let config = {
        default: { ...defaultConfig },
    };
    let twoCaptchaToken;
    if (twoCaptchaToken) {
        const recaptchaPlugin = puppeteer_extra_plugin_recaptcha_1.default({
            provider: { id: '2captcha', token: twoCaptchaToken },
        });
        puppeteer_extra_1.default.use(recaptchaPlugin);
    }
    puppeteer_extra_1.default.use(puppeteer_extra_plugin_stealth_1.default());
    puppeteer_extra_1.default.use(puppeteer_extra_plugin_anonymize_ua_1.default({
        stripHeadless: true,
        makeWindows: true,
    }));
    async function browser(name = 'default') {
        return await lock.acquire(name, async function () {
            let cfg = config[name];
            if (cfg.browserHandle)
                return cfg.browserHandle;
            const args = [
                '--disable-infobars',
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--ignore-certificate-errors',
                '--enable-features=NetworkService',
                `--window-size=${cfg.windowSize.width},${cfg.windowSize.height}`,
            ];
            if (cfg.proxy) {
                args.push(`--proxy-server=${cfg.proxy}`);
            }
            let launchOptions = {
                userDataDir: cfg.userDataDir,
                headless: cfg.headless,
                args,
                ignoreHTTPSErrors: true,
            };
            if (cfg.useChrome === true) {
                launchOptions.executablePath = chrome_paths_1.default.chrome;
            }
            cfg.browserHandle = await puppeteer_extra_1.default.launch(launchOptions);
            return cfg.browserHandle;
        });
    }
    async function makePageFaster(page, name = 'default') {
        let cfg = config[name];
        if (cfg.blockCSS || cfg.blockFonts || cfg.blockImages) {
            await page.setRequestInterception(true);
            page.on('request', (request) => {
                if ((cfg.blockImages && request.resourceType() === 'image') ||
                    (cfg.blockFonts && request.resourceType() === 'font') ||
                    (cfg.blockCSS && request.resourceType() === 'stylesheet')) {
                    request.abort();
                }
                else {
                    request.continue();
                }
            });
        }
        await page.target().createCDPSession();
        await page.setBypassCSP(true);
        await page.setDefaultNavigationTimeout(cfg.defaultNavigationTimeout);
        return page;
    }
    return {
        newPage: async (uniqueName = 'default') => {
            let brow = await browser(uniqueName);
            let page = await brow.newPage();
            await makePageFaster(page, uniqueName);
            return page;
        },
        closeBrowser: async (uniqueName = 'default') => {
            let browserHandle = config[uniqueName].browserHandle;
            if (browserHandle) {
                let bHandle = await browser();
                await bHandle.close();
            }
            browserHandle = null;
        },
        setProxy: (value, uniqueName = 'default') => {
            config[uniqueName].proxy = value;
        },
        setHeadless: (value = false, uniqueName = 'default') => {
            config[uniqueName].headless = value;
        },
        setUserDataDir: (value, uniqueName = 'default') => {
            config[uniqueName].userDataDir = value;
        },
        setWindowSizeArg: (value, uniqueName = 'default') => {
            config[uniqueName].windowSize = value;
        },
        set2captchaToken: (value, uniqueName = 'default') => {
            config[uniqueName].twoCaptchaToken = value;
        },
        setDefaultNavigationTimeout: (value, uniqueName = 'default') => {
            config[uniqueName].defaultNavigationTimeout = value;
        },
        blockImages: (value = true, uniqueName = 'default') => {
            config[uniqueName].blockImages = value;
        },
        blockFonts: (value = true, uniqueName = 'default') => {
            config[uniqueName].blockFonts = value;
        },
        blockCSS: (value = true, uniqueName = 'default') => {
            config[uniqueName].blockCSS = value;
        },
        useChrome: (value = true, uniqueName = 'default') => {
            config[uniqueName].useChrome = value;
        },
    };
})();
//# sourceMappingURL=fastPage.js.map