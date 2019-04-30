"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const util_1 = __importDefault(require("util"));
exports.default = (err) => {
    console.log('[main] We got error');
    console.error(err);
    var log_file_err = fs_1.default.createWriteStream(__dirname + '../../error.log', { flags: 'a' });
    log_file_err.write(util_1.default.format('Caught exception: ' + err) + '\n');
    process.exit(1);
};
//# sourceMappingURL=errorLogger.js.map