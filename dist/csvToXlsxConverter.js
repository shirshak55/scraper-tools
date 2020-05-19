"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertCsvToXlsx = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const sync_1 = __importDefault(require("csv-parse/lib/sync"));
const xlsx_1 = __importDefault(require("xlsx"));
function convertCsvToXlsx(source, destination) {
    if (typeof source !== "string" || typeof destination !== "string") {
        throw new Error(`"source" and "destination" arguments must be of type string.`);
    }
    if (!fs_extra_1.default.existsSync(source)) {
        throw new Error(`source "${source}" doesn't exist.`);
    }
    const csvFile = fs_extra_1.default.readFileSync(source, "utf-8");
    const csvOptions = {
        columns: true,
        delimiter: ",",
        ltrim: true,
        rtrim: true,
    };
    const records = sync_1.default(csvFile, csvOptions);
    const wb = xlsx_1.default.utils.book_new();
    const ws = xlsx_1.default.utils.json_to_sheet(records);
    xlsx_1.default.utils.book_append_sheet(wb, ws);
    xlsx_1.default.writeFile(wb, String(destination));
}
exports.convertCsvToXlsx = convertCsvToXlsx;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3N2VG9YbHN4Q29udmVydGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NzdlRvWGxzeENvbnZlcnRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSx3REFBeUI7QUFDekIsOERBQW9DO0FBQ3BDLGdEQUF1QjtBQUV2QixTQUFnQixnQkFBZ0IsQ0FBQyxNQUFjLEVBQUUsV0FBbUI7SUFDbEUsSUFBSSxPQUFPLE1BQU0sS0FBSyxRQUFRLElBQUksT0FBTyxXQUFXLEtBQUssUUFBUSxFQUFFO1FBQ2pFLE1BQU0sSUFBSSxLQUFLLENBQUMsOERBQThELENBQUMsQ0FBQTtLQUNoRjtJQUdELElBQUksQ0FBQyxrQkFBRSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsRUFBRTtRQUMxQixNQUFNLElBQUksS0FBSyxDQUFDLFdBQVcsTUFBTSxrQkFBa0IsQ0FBQyxDQUFBO0tBQ3JEO0lBR0QsTUFBTSxPQUFPLEdBQUcsa0JBQUUsQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFBO0lBR2hELE1BQU0sVUFBVSxHQUFHO1FBQ2pCLE9BQU8sRUFBRSxJQUFJO1FBQ2IsU0FBUyxFQUFFLEdBQUc7UUFDZCxLQUFLLEVBQUUsSUFBSTtRQUNYLEtBQUssRUFBRSxJQUFJO0tBQ1osQ0FBQTtJQUdELE1BQU0sT0FBTyxHQUFHLGNBQUcsQ0FBQyxPQUFPLEVBQUUsVUFBVSxDQUFDLENBQUE7SUFHeEMsTUFBTSxFQUFFLEdBQUcsY0FBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQTtJQUdoQyxNQUFNLEVBQUUsR0FBRyxjQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQTtJQUM1QyxjQUFJLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQTtJQUdwQyxjQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQTtBQUN6QyxDQUFDO0FBakNELDRDQWlDQyJ9