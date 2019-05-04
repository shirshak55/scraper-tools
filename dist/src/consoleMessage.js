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
const right_pad_1 = __importDefault(require("right-pad"));
exports.default = (() => {
    let desktopPath = path_1.default.join(os_1.default.homedir(), 'Desktop');
    let logFolder = createDirectories_1.default(path_1.default.join(desktopPath, 'logs'));
    const setLogFolder = (value) => {
        logFolder = value;
    };
    const titlify = (title) => {
        if (typeof title === 'object') {
            return right_pad_1.default(`[${title.title}]`, title.padding, ' ');
        }
        else {
            return `[${title}]`;
        }
    };
    const logToFile = (title, content) => {
        let c = content;
        try {
            let c = JSON.stringify(titlify(title) + ' ' + content, null, 4);
        }
        catch (e) { }
        fs_1.default.appendFileSync(path_1.default.join(logFolder, 'log.txt'), '\n' + c);
    };
    const error = (title, ...s) => {
        logToFile(title, s.join(' '));
        return console.log(chalk_1.default.bgRed.green(titlify(title)), ...s);
    };
    const info = (title, ...s) => {
        logToFile(title, s.join(' '));
        console.log(chalk_1.default.bgBlue.white(titlify(title)), ...s);
    };
    const warning = (title, ...s) => {
        logToFile(title, s.join(' '));
        console.log(chalk_1.default.bgYellow.red(titlify(title)), ...s);
    };
    const success = (title, ...s) => {
        logToFile(title, s.join(' '));
        console.log(chalk_1.default.bgGreen.red(titlify(title)), ...s);
    };
    return {
        desktopPath,
        logFolder,
        setLogFolder,
        logToFile,
        error,
        info,
        warning,
        success,
    };
})();
//# sourceMappingURL=consoleMessage.js.map