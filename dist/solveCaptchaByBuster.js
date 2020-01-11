"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const delay_1 = __importDefault(require("delay"));
const consoleMessage_1 = __importDefault(require("./consoleMessage"));
const waitForFrames_1 = __importDefault(require("./waitForFrames"));
async function getCaptchaFrame(page) {
    return await waitForFrames_1.default(page, "https://www.google.com/recaptcha/api2/anchor");
}
async function getBusterCaptchaFrame(page) {
    return await waitForFrames_1.default(page, "https://www.google.com/recaptcha/api2/bframe");
}
async function solver(page) {
    consoleMessage_1.default.success("Buster", "Clicking on captcha btn");
    let captchaFrame = await getCaptchaFrame(page);
    await (await captchaFrame.waitForSelector("#recaptcha-anchor > div.recaptcha-checkbox-border", { visible: true })).click();
    consoleMessage_1.default.success("Buster", "Waiting for buster frames");
    let bCaptchaFrame = await getBusterCaptchaFrame(page);
    consoleMessage_1.default.success("Buster", "Clicking on buster solver icon");
    while (true) {
        try {
            const recaptchaSolveButton = await bCaptchaFrame.waitForSelector("#solver-button", {
                visible: true,
                timeout: 1000
            });
            await recaptchaSolveButton.click();
        }
        catch (e) {
            break;
        }
    }
    try {
        const recaptchaReload = await bCaptchaFrame.waitForSelector("#reset-button", {
            visible: true,
            timeout: 500
        });
        await recaptchaReload.click();
    }
    catch (e) { }
}
async function default_1(page) {
    while (true) {
        console.log("ssss");
        await solver(page);
        console.log("get captcha frame");
        try {
            let captchaFrame = await getCaptchaFrame(page);
            let captchaClasses = await captchaFrame.evaluate(() => {
                if (document.querySelector(".recaptcha-checkbox")) {
                    return document.querySelector(".recaptcha-checkbox").className;
                }
                return false;
            });
            if (captchaClasses.includes("recaptcha-checkbox-checked")) {
                break;
            }
        }
        catch (e) { }
        await delay_1.default(1000);
    }
    consoleMessage_1.default.success("Buster", "Captcha should be solved");
}
exports.default = default_1;
//# sourceMappingURL=solveCaptchaByBuster.js.map