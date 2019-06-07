"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const async_lock_1 = __importDefault(require("async-lock"));
let lock = new async_lock_1.default();
const json2csv_1 = require("json2csv");
exports.default = async (fields, jsObjects) => {
    return await lock.acquire('productCSVUpdate', async () => {
        const parser = new json2csv_1.Parser({
            fields,
        });
        return parser.parse(jsObjects);
    });
};
//# sourceMappingURL=jsonToCsv.js.map