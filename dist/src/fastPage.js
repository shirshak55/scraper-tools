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
const puppeteer_extra_plugin_recaptcha_1 = __importDefault(require("puppeteer-extra-plugin-recaptcha"));
const chalk_1 = __importDefault(require("chalk"));
const recaptchaPlugin = puppeteer_extra_plugin_recaptcha_1.default({
    provider: { id: '2captcha', token: '2a82c98a5b6fb14b53bfbcc03fd02d20' },
});
puppeteer_extra_1.default.use(puppeteer_extra_plugin_stealth_1.default());
puppeteer_extra_1.default.use(recaptchaPlugin);
let b = null;
let proxy = { value: null };
let browser = async () => {
    const uBlockExt = path_1.default.join(__dirname, './extensions/uBlock');
    if (b)
        return b;
    const args = ['--no-sandbox', `--disable-extensions-except=${uBlockExt}`, `--load-extension=${uBlockExt}`];
    if (proxy.value) {
        args.push(`--proxy-server=${proxy.value}`);
    }
    console.log(chalk_1.default.magenta(`[Browser]`), 'Starting to launch bot with proxy', proxy.value);
    b = await puppeteer_extra_1.default.launch({
        userDataDir: path_1.default.join(__dirname + '../../../.user-dir'),
        executablePath: chrome_paths_1.default.chrome,
        headless: false,
        args,
    });
    return b;
};
async function makePageFaster(page) {
    await page.setDefaultNavigationTimeout(120 * 1000);
    await page.evaluateOnNewDocument(() => {
        Object.defineProperty(document, 'hidden', { value: false });
    });
    return page;
}
exports.default = {
    newPage: async () => {
        let brow = await browser();
        let page = await brow.newPage();
        await makePageFaster(page);
        return page;
    },
    closeBrowser: async () => {
        if (b) {
            let brow = await browser();
            await brow.close();
        }
        b = null;
    },
    setProxy: (value) => {
        let p = { ...proxy };
        proxy = p;
    },
};
//# sourceMappingURL=fastPage.js.map