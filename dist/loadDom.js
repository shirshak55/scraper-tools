"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cheerio_1 = __importDefault(require("cheerio"));
const consoleMessage_1 = __importDefault(require("./consoleMessage"));
exports.default = (dom) => {
    try {
        return cheerio_1.default.load(dom);
    }
    catch (e) {
        consoleMessage_1.default.error('Load Dom', 'Error from loadDom', e);
    }
};
//# sourceMappingURL=loadDom.js.map