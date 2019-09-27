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
let lock = new async_lock_1.default();
exports.default = (() => {
    let twoCaptchaToken;
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
    };
    let config = {
        default: { ...defaultConfig },
    };
    async function browser(instanceName = 'default') {
        return await lock
            .acquire('instance_' + instanceName, async function () {
            if (config[instanceName].browserHandle)
                return config[instanceName].browserHandle;
            const args = [
                `--window-size=${config[instanceName].windowSize.width},${config[instanceName].windowSize.height}`,
            ];
            if (config[instanceName].proxy) {
                args.push(`--proxy-server=${config[instanceName].proxy}`);
            }
            if (config[instanceName].extensions.length > 0) {
                args.push(`--disable-extensions-except=${config[instanceName].extensions.join(',')}`, `--load-extension=${config[instanceName].extensions.join(',')}`);
            }
            let launchOptions = {
                userDataDir: config[instanceName].userDataDir,
                headless: config[instanceName].headless,
                args,
                ignoreHTTPSErrors: true,
            };
            launchOptions.executablePath = chrome_paths_1.default.chrome;
            config[instanceName].browserHandle = await puppeteer_core_1.default.launch(launchOptions);
            return config[instanceName].browserHandle;
        })
            .catch((err) => console.log('Error on starting new page: Lock Error ->', err));
    }
    async function makePageFaster(page, instanceName = 'default') {
        await page.setDefaultNavigationTimeout(config[instanceName].defaultNavigationTimeout);
        await page.setDefaultTimeout(config[instanceName].defaultNavigationTimeout);
        const session = await page.target().createCDPSession();
        await page.setBypassCSP(true);
        await pageStealth_1.default(page);
        if (config[instanceName].showPageError === true) {
            page.on('error', (err) => {
                consoleMessage_1.default.error('Error happen at the page: ', err);
            });
            page.on('pageerror', (pageerr) => {
                consoleMessage_1.default.error('Page Error occurred: ', pageerr);
            });
        }
        if (config[instanceName].blockCSS || config[instanceName].blockFonts || config[instanceName].blockImages) {
            await page.setRequestInterception(true);
            page.on('request', (request) => {
                if ((config[instanceName].blockImages && request.resourceType() === 'image') ||
                    (config[instanceName].blockFonts && request.resourceType() === 'font') ||
                    (config[instanceName].blockCSS && request.resourceType() === 'stylesheet')) {
                    request.abort();
                }
                else {
                    request.continue();
                }
            });
        }
        await session.send('Page.enable');
        await session.send('Page.setWebLifecycleState', {
            state: 'active',
        });
        return page;
    }
    return {
        init: async (instanceName, useCurrentDefaultConfig = true) => {
            if (useCurrentDefaultConfig) {
                config[instanceName] = { ...config.default };
            }
            else {
                config[instanceName] = { ...defaultConfig };
            }
        },
        newPage: async (instanceName = 'default') => {
            consoleMessage_1.default.info('Fast Page', 'Launching new page ');
            let brow = await browser(instanceName);
            let page = await brow.newPage();
            await makePageFaster(page, instanceName);
            return page;
        },
        closeBrowser: async (instanceName = 'default') => {
            consoleMessage_1.default.info('Fast Page', 'Requesting to close browser ');
            return await lock
                .acquire('instance_close_' + instanceName, async function () {
                if (config[instanceName].browserHandle) {
                    let bHandle = await browser(instanceName);
                    await bHandle.close();
                }
                config[instanceName].browserHandle = null;
                return 'closed';
            })
                .catch((err) => console.log('Error on closing browser: Lock Error ->', err));
        },
        setProxy: (value, instanceName = 'default') => {
            consoleMessage_1.default.info('Fast Page', 'Setting proxy to ', value);
            config[instanceName].proxy = value;
        },
        setHeadless: (value = false, instanceName = 'default') => {
            consoleMessage_1.default.info('Fast Page', 'Setting headless to ', value);
            config[instanceName].headless = value;
        },
        setUserDataDir: (value, instanceName = 'default') => {
            consoleMessage_1.default.info('Fast Page', 'Storing chrome cache in  ', value);
            config[instanceName].userDataDir = value;
        },
        setWindowSizeArg: (value, instanceName = 'default') => {
            consoleMessage_1.default.info('Fast Page', 'Setting window size to ', value);
            config[instanceName].windowSize = value;
        },
        set2captchaToken: (value, instanceName = 'default') => {
            consoleMessage_1.default.info('Fast Page', 'Setting 2captcha token to ', value);
            config[instanceName].twoCaptchaToken = value;
        },
        setExtensionsPaths: (value, instanceName = 'default') => {
            config[instanceName].extensions = value;
        },
        setDefaultNavigationTimeout: (value, instanceName = 'default') => {
            consoleMessage_1.default.info('Fast Page', 'Default navigation timeout', value);
            config[instanceName].defaultNavigationTimeout = value;
        },
        blockImages: (value = true, instanceName = 'default') => {
            consoleMessage_1.default.info('Fast Page', 'Block Image', value);
            config[instanceName].blockImages = value;
        },
        blockFonts: (value = true, instanceName = 'default') => {
            consoleMessage_1.default.info('Fast Page', 'Block Font', value);
            config[instanceName].blockFonts = value;
        },
        blockCSS: (value = true, instanceName = 'default') => {
            consoleMessage_1.default.info('Fast Page', 'Block CSS', value);
            config[instanceName].blockCSS = value;
        },
        getConfig(instanceName = null) {
            if (instanceName === null) {
                return config;
            }
            return config[instanceName];
        },
    };
})();
//# sourceMappingURL=index.js.map