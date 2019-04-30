"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const createDirectories_1 = __importDefault(require("./createDirectories"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const os_1 = __importDefault(require("os"));
const desktopPath = path_1.default.join(os_1.default.homedir(), 'Desktop');
const logFolder = createDirectories_1.default(path_1.default.join(desktopPath, 'Aliexpress_Scrapper/logs'));
exports.logToFile = (content) => {
    let c = content;
    try {
        let c = JSON.stringify(content, null, 4);
    }
    catch (e) { }
    fs_1.default.appendFileSync(path_1.default.join(logFolder, 'log.txt'), '\n' + c);
};
exports.error = (...s) => {
    exports.logToFile(s.join(' '));
    return console.log(chalk_1.default.bgRed.green(...s));
};
exports.info = (...s) => {
    exports.logToFile(s.join(' '));
    console.log(chalk_1.default.bgBlue.white(...s));
};
exports.warning = (...s) => {
    exports.logToFile(s.join(' '));
    console.log(chalk_1.default.bgYellow.red(...s));
};
exports.success = (...s) => {
    exports.logToFile(s.join(' '));
    console.log(chalk_1.default.bgGreen.red(...s));
};
exports.default = {
    desktopPath,
    logFolder,
    logToFile: exports.logToFile,
    error: exports.error,
    info: exports.info,
    warning: exports.warning,
    success: exports.success,
};
//# sourceMappingURL=consoleMessage.js.map