"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// this requires you to install buster extension
const waitForFrames_1 = __importDefault(require("./waitForFrames"));
async function default_1(page) {
    try {
        let frame = await waitForFrames_1.default(page, "recaptcha/api2/bframe");
        const recaptchaSolveButton = await frame.waitForSelector("#solver-button", {
            visible: true
        });
        await recaptchaSolveButton.click();
    }
    catch (e) { }
}
exports.default = default_1;
//# sourceMappingURL=solveCaptchaByBuster.js.map