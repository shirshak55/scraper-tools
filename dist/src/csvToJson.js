"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const csvtojson_1 = __importDefault(require("csvtojson"));
const async_lock_1 = __importDefault(require("async-lock"));
let lock = new async_lock_1.default();
exports.default = async (path) => {
    return await lock.acquire(path, async function () {
        return await csvtojson_1.default().fromFile(path);
    });
};
//# sourceMappingURL=csvToJson.js.map