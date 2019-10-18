"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// this requires you to install buster extension
const delay_1 = __importDefault(require("delay"));
async function default_1(page) {
    let captchaFrame = null;
    let tries = 0;
    while (true) {
        captchaFrame = page
            .frames()
            .find((f) => f.url().includes("www.google.com/recaptcha/api2") > 0);
        if (captchaFrame) {
            break;
        }
        if (tries > 200) {
            throw "cant find captcha frame";
            return;
        }
        await delay_1.default(100);
    }
    // to click we can use following code
    // let captchaClickHandler = await captchaFrame.waitForSelector(
    //   "#recaptcha-anchor > div.recaptcha-checkbox-border",
    //   { visible: true }
    // )
    // captchaClickHandler.click()
    const recaptchaSolveButton = await captchaFrame.waitForSelector("#solver-button", {
        visible: true
    });
    await recaptchaSolveButton.click();
}
exports.default = default_1;
//# sourceMappingURL=solveCaptchaByBuster.js.map