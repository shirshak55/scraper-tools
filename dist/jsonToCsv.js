"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const async_lock_1 = __importDefault(require("async-lock"));
let lock = new async_lock_1.default();
const json2csv_1 = require("json2csv");
async function jsonToCsv(fields, jsObjects) {
    return await lock.acquire("jsonToCSV", async () => {
        const parser = new json2csv_1.Parser({
            fields
        });
        return parser.parse(jsObjects);
    });
}
exports.jsonToCsv = jsonToCsv;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvblRvQ3N2LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2pzb25Ub0Nzdi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDREQUFrQztBQUNsQyxJQUFJLElBQUksR0FBRyxJQUFJLG9CQUFTLEVBQUUsQ0FBQTtBQUMxQix1Q0FBaUM7QUFFMUIsS0FBSyxVQUFVLFNBQVMsQ0FBQyxNQUFrQixFQUFFLFNBQWM7SUFDaEUsT0FBTyxNQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLEtBQUssSUFBSSxFQUFFO1FBQ2hELE1BQU0sTUFBTSxHQUFHLElBQUksaUJBQU0sQ0FBQztZQUN4QixNQUFNO1NBQ1AsQ0FBQyxDQUFBO1FBQ0YsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFBO0lBQ2hDLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQztBQVBELDhCQU9DIn0=