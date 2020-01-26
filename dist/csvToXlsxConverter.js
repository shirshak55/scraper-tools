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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3N2VG9YbHN4Q29udmVydGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NzdlRvWGxzeENvbnZlcnRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHdEQUF5QjtBQUN6Qiw4REFBb0M7QUFDcEMsZ0RBQXVCO0FBRXZCLFNBQXdCLGdCQUFnQixDQUFDLE1BQWMsRUFBRSxXQUFtQjtJQUMxRSxJQUFJLE9BQU8sTUFBTSxLQUFLLFFBQVEsSUFBSSxPQUFPLFdBQVcsS0FBSyxRQUFRLEVBQUU7UUFDakUsTUFBTSxJQUFJLEtBQUssQ0FDYiw4REFBOEQsQ0FDL0QsQ0FBQTtLQUNGO0lBR0QsSUFBSSxDQUFDLGtCQUFFLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxFQUFFO1FBQzFCLE1BQU0sSUFBSSxLQUFLLENBQUMsV0FBVyxNQUFNLGtCQUFrQixDQUFDLENBQUE7S0FDckQ7SUFHRCxNQUFNLE9BQU8sR0FBRyxrQkFBRSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUE7SUFHaEQsTUFBTSxVQUFVLEdBQUc7UUFDakIsT0FBTyxFQUFFLElBQUk7UUFDYixTQUFTLEVBQUUsR0FBRztRQUNkLEtBQUssRUFBRSxJQUFJO1FBQ1gsS0FBSyxFQUFFLElBQUk7S0FDWixDQUFBO0lBR0QsTUFBTSxPQUFPLEdBQUcsY0FBRyxDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUMsQ0FBQTtJQUd4QyxNQUFNLEVBQUUsR0FBRyxjQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFBO0lBR2hDLE1BQU0sRUFBRSxHQUFHLGNBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0lBQzVDLGNBQUksQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFBO0lBR3BDLGNBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFBO0FBQ3pDLENBQUM7QUFuQ0QsbUNBbUNDIn0=