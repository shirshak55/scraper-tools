"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const consoleMessage_1 = __importDefault(require("./consoleMessage"));
exports.default = (fileName, content) => {
    try {
        fs_1.default.writeFileSync(fileName, content);
    }
    catch (e) {
        consoleMessage_1.default.error('Error while writing file:::', e);
    }
};
//# sourceMappingURL=writeFileSync.js.map