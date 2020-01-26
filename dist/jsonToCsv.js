"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const async_lock_1 = __importDefault(require("async-lock"));
let lock = new async_lock_1.default();
const json2csv_1 = require("json2csv");
exports.default = async (fields, jsObjects) => {
    return await lock.acquire("jsonToCSV", async () => {
        const parser = new json2csv_1.Parser({
            fields
        });
        return parser.parse(jsObjects);
    });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvblRvQ3N2LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2pzb25Ub0Nzdi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDREQUFtQztBQUNuQyxJQUFJLElBQUksR0FBRyxJQUFJLG9CQUFTLEVBQUUsQ0FBQztBQUMzQix1Q0FBa0M7QUFFbEMsa0JBQWUsS0FBSyxFQUFFLE1BQWtCLEVBQUUsU0FBYyxFQUFFLEVBQUU7SUFDMUQsT0FBTyxNQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLEtBQUssSUFBSSxFQUFFO1FBQ2hELE1BQU0sTUFBTSxHQUFHLElBQUksaUJBQU0sQ0FBQztZQUN4QixNQUFNO1NBQ1AsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ2pDLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDIn0=