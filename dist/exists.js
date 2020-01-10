"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { promisify } = require('util');
const fs = require('fs');
const stat = promisify(fs.stat);
async function default_1(filePath) {
    try {
        await stat(filePath);
        return true;
    }
    catch (err) {
        return false;
    }
}
exports.default = default_1;
//# sourceMappingURL=exists.js.map