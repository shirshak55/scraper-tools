"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const p_wait_for_1 = __importDefault(require("p-wait-for"));
const pending_xhr_puppeteer_1 = __importDefault(require("pending-xhr-puppeteer"));
exports.default = async (page, no_of_xhr_request = 1) => {
    const p = new pending_xhr_puppeteer_1.default(page);
    await Promise.all([
        p_wait_for_1.default(() => p.finishedWithSuccessXhrs.size === no_of_xhr_request),
        pending_xhr_puppeteer_1.default.waitForAllXhrFinished(),
    ]);
};
//# sourceMappingURL=waitForXhr.js.map