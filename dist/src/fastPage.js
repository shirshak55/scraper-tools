"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_extra_1 = __importDefault(require("puppeteer-extra"));
const puppeteer_extra_plugin_stealth_1 = __importDefault(require("puppeteer-extra-plugin-stealth"));
const puppeteer_extra_plugin_anonymize_ua_1 = __importDefault(require("puppeteer-extra-plugin-anonymize-ua"));
const puppeteer_extra_plugin_recaptcha_1 = __importDefault(require("puppeteer-extra-plugin-recaptcha"));
exports.default = (() => {
    let browserHandle = null;
    let proxy = null;
    let twoCaptchaToken = '';
    let headless = false;
    let userDataDir = null;
    let windowSize = { width: 595, height: 842 };
    let blockFonts = false;
    let blockImages = false;
    let blockCSS = false;
    const recaptchaPlugin = puppeteer_extra_plugin_recaptcha_1.default({
        provider: { id: '2captcha', token: twoCaptchaToken },
    });
    puppeteer_extra_1.default.use(puppeteer_extra_plugin_stealth_1.default());
    puppeteer_extra_1.default.use(recaptchaPlugin);
    puppeteer_extra_1.default.use(puppeteer_extra_plugin_anonymize_ua_1.default({
        stripHeadless: true,
        makeWindows: true,
    }));
    async function browser() {
        if (browserHandle)
            return browserHandle;
        const args = [
            '--disable-infobars',
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--ignore-certificate-errors',
            '--enable-features=NetworkService',
            `--window-size=${windowSize.width},${windowSize.height}`,
        ];
        if (proxy) {
            args.push(`--proxy-server=${proxy}`);
        }
        browserHandle = await puppeteer_extra_1.default.launch({
            userDataDir,
            // executablePath: chromePaths.chrome,
            headless,
            args,
            ignoreHTTPSErrors: true,
        });
        return browserHandle;
    }
    async function makePageFaster(page) {
        await page.setRequestInterception(true);
        page.on('request', (request) => {
            if ((blockImages && request.resourceType() === 'image') ||
                (blockFonts && request.resourceType() === 'font') ||
                (blockCSS && request.resourceType() === 'stylesheet')) {
                request.abort();
            }
            else {
                request.continue();
            }
        });
        await page.target().createCDPSession();
        await page.setBypassCSP(true);
        await page.setDefaultNavigationTimeout(60 * 1000);
        return page;
    }
    return {
        newPage: async () => {
            let brow = await browser();
            let page = await brow.newPage();
            await makePageFaster(page);
            return page;
        },
        closeBrowser: async () => {
            if (browserHandle) {
                let bHandle = await browser();
                await bHandle.close();
            }
            browserHandle = null;
        },
        setProxy: (value) => {
            proxy = value;
        },
        setHeadless: (value = false) => {
            headless = value;
        },
        setUserDataDir: (value) => {
            userDataDir = value;
        },
        setWindowSizeArg: (value) => {
            windowSize = value;
        },
        set2captchaToken: (value) => {
            twoCaptchaToken = value;
        },
        blockImages: (value = false) => {
            blockImages = value;
        },
        blockFonts: (value = false) => {
            blockFonts = value;
        },
        blockCSS: (value = false) => {
            blockCSS = value;
        },
    };
})();
//# sourceMappingURL=fastPage.js.map