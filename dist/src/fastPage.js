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
        extensions: [],
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
        return await lock.acquire('instance_' + name, async function () {
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
                '--disable-background-timer-throttling',
                '--disable-backgrounding-occluded-windows',
                '--disable-renderer-backgrounding',
            ];
            if (cfg.proxy) {
                args.push(`--proxy-server=${cfg.proxy}`);
            }
            if (cfg.extensions.length > 0) {
                for (let p of cfg.extensions) {
                    args.push(`--disable-extensions-except=${p}`, `--load-extension=${p}`);
                }
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
        const session = await page.target().createCDPSession();
        await page.setBypassCSP(true);
        await session.send('Page.enable');
        await session.send('Page.setWebLifecycleState', { state: 'active' });
        await page.setDefaultNavigationTimeout(cfg.defaultNavigationTimeout);
        return page;
    }
    return {
        init: async (instanceName, useCurrentDefaultConfig = false) => {
            if (useCurrentDefaultConfig) {
                config[instanceName] = { ...config.default };
            }
            else {
                config[instanceName] = { ...defaultConfig };
            }
        },
        newPage: async (instanceName = 'default') => {
            let brow = await browser(instanceName);
            let page = await brow.newPage();
            await makePageFaster(page, instanceName);
            return page;
        },
        closeBrowser: async (instanceName = 'default') => {
            return await lock.acquire('instance_' + name, async function () {
                let browserHandle = config[instanceName].browserHandle;
                if (browserHandle) {
                    let bHandle = await browser();
                    await bHandle.close();
                }
                browserHandle = null;
            });
        },
        setProxy: (value, instanceName = 'default') => {
            config[instanceName].proxy = value;
        },
        setHeadless: (value = false, instanceName = 'default') => {
            config[instanceName].headless = value;
        },
        setUserDataDir: (value, instanceName = 'default') => {
            config[instanceName].userDataDir = value;
        },
        setWindowSizeArg: (value, instanceName = 'default') => {
            config[instanceName].windowSize = value;
        },
        set2captchaToken: (value, instanceName = 'default') => {
            config[instanceName].twoCaptchaToken = value;
        },
        setExtensionsPaths: (value, instanceName = 'default') => {
            config[instanceName].extensions = value;
        },
        setDefaultNavigationTimeout: (value, instanceName = 'default') => {
            config[instanceName].defaultNavigationTimeout = value;
        },
        blockImages: (value = true, instanceName = 'default') => {
            config[instanceName].blockImages = value;
        },
        blockFonts: (value = true, instanceName = 'default') => {
            config[instanceName].blockFonts = value;
        },
        blockCSS: (value = true, instanceName = 'default') => {
            config[instanceName].blockCSS = value;
        },
        useChrome: (value = true, instanceName = 'default') => {
            config[instanceName].useChrome = value;
        },
    };
})();
//# sourceMappingURL=fastPage.js.map