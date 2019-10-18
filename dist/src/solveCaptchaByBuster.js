"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// this requires you to install buster extension
const delay_1 = __importDefault(require("delay"));
const consoleMessage_1 = __importDefault(require("./consoleMessage"));
async function default_1(page) {
    let captchaFrame = null;
    let tries = 0;
    let bCaptchaFrame = null;
    consoleMessage_1.default.info("Buster", "Start solving captcha");
    while (true) {
        captchaFrame = page
            .frames()
            .find((f) => f.url().includes("https://www.google.com/recaptcha/api2/anchor"));
        if (captchaFrame) {
            break;
        }
        if (tries > 20) {
            throw "cant find captcha frame";
            return;
        }
        await delay_1.default(100);
    }
    console.log("Got captcha frame", captchaFrame.url());
    consoleMessage_1.default.success("Buster", "Clicking on captcha btn");
    let captchaBtn = await captchaFrame.waitForSelector("#recaptcha-anchor > div.recaptcha-checkbox-border", { visible: true });
    captchaBtn.click();
    console.log(page.frames().map((v) => v.url()));
    consoleMessage_1.default.success("Buster", "Waiting for buster frames");
    while (true) {
        bCaptchaFrame = page
            .frames()
            .find((f) => f.url().includes("https://www.google.com/recaptcha/api2/bframe"));
        if (bCaptchaFrame) {
            break;
        }
        if (tries > 200) {
            throw "cant find buster captcha frame";
            return;
        }
        await delay_1.default(100);
    }
    consoleMessage_1.default.success("Buster", "Clicking on buster solver icon");
    while (true) {
        const recaptchaSolveButton = await bCaptchaFrame.waitForSelector("#solver-button", {
            visible: true
        });
        await recaptchaSolveButton.click();
        try {
            await bCaptchaFrame.waitForSelector("#solver-button", {
                visible: true,
                timeout: 1000
            });
        }
        catch (e) {
            break;
        }
    }
    consoleMessage_1.default.success("Buster", "Captcha should be solved");
}
exports.default = default_1;
//# sourceMappingURL=solveCaptchaByBuster.js.map