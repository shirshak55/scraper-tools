"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const waitForFrames_1 = __importDefault(require("./waitForFrames"));
async function default_1(page) {
    let frame = await waitForFrames_1.default(page, "recaptcha/api2/bframe");
    const recaptchaSolveButton = await frame.waitForSelector("#solver-button", {
        visible: true
    });
    await recaptchaSolveButton.click();
}
exports.default = default_1;
//# sourceMappingURL=solveNoCaptchaRecaptchaByBuster.js.map