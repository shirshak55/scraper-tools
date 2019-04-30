"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const xlsx_1 = __importDefault(require("xlsx"));
const fs_1 = __importDefault(require("fs"));
exports.default = (path) => {
    const table = xlsx_1.default.read(fs_1.default.readFileSync(path), { type: 'buffer' });
    var sheet_name_list = table.SheetNames;
    return xlsx_1.default.utils.sheet_to_json(table.Sheets[sheet_name_list[0]]);
};
//# sourceMappingURL=xlsxReader.js.map