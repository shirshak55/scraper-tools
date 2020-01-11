"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const sync_1 = __importDefault(require("csv-parse/lib/sync"));
const xlsx_1 = __importDefault(require("xlsx"));
function convertCsvToXlsx(source, destination) {
    if (typeof source !== 'string' || typeof destination !== 'string') {
        throw new Error(`"source" and "destination" arguments must be of type string.`);
    }
    if (!fs_extra_1.default.existsSync(source)) {
        throw new Error(`source "${source}" doesn't exist.`);
    }
    const csvFile = fs_extra_1.default.readFileSync(source, 'UTF-8');
    const csvOptions = {
        columns: true,
        delimiter: ',',
        ltrim: true,
        rtrim: true,
    };
    const records = sync_1.default(csvFile, csvOptions);
    const wb = xlsx_1.default.utils.book_new();
    const ws = xlsx_1.default.utils.json_to_sheet(records);
    xlsx_1.default.utils.book_append_sheet(wb, ws);
    xlsx_1.default.writeFile(wb, String(destination));
}
exports.default = convertCsvToXlsx;
//# sourceMappingURL=csvToXlsxConverter.js.map