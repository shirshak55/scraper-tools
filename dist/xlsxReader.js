"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const xlsx_1 = __importDefault(require("xlsx"));
const fs_1 = __importDefault(require("fs"));
function xlsxReader(path) {
    const table = xlsx_1.default.read(fs_1.default.readFileSync(path), { type: "buffer" });
    var sheet_name_list = table.SheetNames;
    return xlsx_1.default.utils.sheet_to_json(table.Sheets[sheet_name_list[0]]);
}
exports.xlsxReader = xlsxReader;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieGxzeFJlYWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy94bHN4UmVhZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsZ0RBQXVCO0FBQ3ZCLDRDQUFpQztBQUVqQyxTQUFnQixVQUFVLENBQUMsSUFBYztJQUN2QyxNQUFNLEtBQUssR0FBRyxjQUFJLENBQUMsSUFBSSxDQUFDLFlBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQTtJQUNsRSxJQUFJLGVBQWUsR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFBO0lBQ3RDLE9BQU8sY0FBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ25FLENBQUM7QUFKRCxnQ0FJQyJ9