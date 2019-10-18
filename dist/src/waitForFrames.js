"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const delay_1 = __importDefault(require("delay"));
async function waitForFrame(page, frameUrl) {
    while (true) {
        let f = page.frames().find((f) => f.url().includes(frameUrl));
        if (f) {
            return f;
        }
        await delay_1.default(100);
    }
}
exports.default = waitForFrame;
//# sourceMappingURL=waitForFrames.js.map