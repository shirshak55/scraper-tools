"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const p_retry_1 = __importDefault(require("p-retry"));
const fs = require('fs');
const got = require('got');
const exists = require('./exists');
async function download(filePath, url) {
    if (await exists(filePath)) {
        return;
    }
    console.log(chalk_1.default.dim(`    Downloading: ${chalk_1.default.italic(url)}`));
    await p_retry_1.default(() => {
        new Promise((resolve, reject) => {
            got
                .stream(url, { retry: 4, throwHttpErrors: false })
                .on('error', (err) => {
                console.error(err);
                resolve();
            })
                .pipe(fs.createWriteStream(filePath))
                .on('finish', resolve)
                .on('error', (err) => {
                console.error(err);
                fs.unlink(filePath, () => resolve);
            });
        });
    }, { retries: 3 });
}
exports.default = download;
//# sourceMappingURL=downloader.js.map