"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import puppeteer from 'puppeteer-core'
const chrome_paths_1 = __importDefault(require("chrome-paths"));
const path_1 = __importDefault(require("path"));
const puppeteer_extra_1 = __importDefault(require("puppeteer-extra"));
const puppeteer_extra_plugin_stealth_1 = __importDefault(require("puppeteer-extra-plugin-stealth"));
const puppeteer_extra_plugin_anonymize_ua_1 = __importDefault(require("puppeteer-extra-plugin-anonymize-ua"));
const puppeteer_extra_plugin_recaptcha_1 = __importDefault(require("puppeteer-extra-plugin-recaptcha"));
exports.default = (() => {
    let browserHandle = null;
    let proxy = null;
    let twoCaptchaToken = '';
    let headless = false;
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
        const uBlockExt = path_1.default.join(__dirname, './extensions/uBlock');
        if (browserHandle)
            return browserHandle;
        const args = ['--no-sandbox', `--disable-extensions-except=${uBlockExt}`, `--load-extension=${uBlockExt}`];
        if (proxy) {
            args.push(`--proxy-server=${proxy}`);
        }
        browserHandle = await puppeteer_extra_1.default.launch({
            userDataDir: path_1.default.join(__dirname + '../../../.user-dir'),
            executablePath: chrome_paths_1.default.chrome,
            headless,
            args,
        });
        return browserHandle;
    }
    async function makePageFaster(page) {
        await page.setDefaultNavigationTimeout(120 * 1000);
        await page.evaluateOnNewDocument(() => {
            Object.defineProperty(document, 'hidden', { value: false });
        });
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
        setHeadless: (value) => {
            headless: value;
        },
        set2captchaToken: (value) => {
            twoCaptchaToken = value;
        },
    };
})();
//# sourceMappingURL=fastPage.js.map