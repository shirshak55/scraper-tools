"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const util_1 = __importDefault(require("util"));
const consoleMessage_1 = __importDefault(require("./consoleMessage"));
exports.default = (err, path) => {
    consoleMessage_1.default.error('Error Logger', 'We Got Error', err);
    fs_extra_1.default.ensureFileSync(path);
    let log_file_err = fs_extra_1.default.createWriteStream(path, { flags: 'a' });
    log_file_err.write(util_1.default.format('Caught exception: ' + err) + '\n');
    process.exit(1);
};
//# sourceMappingURL=errorLogger.js.map