"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonToCsv = void 0;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvblRvQ3N2LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2pzb25Ub0Nzdi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSw0REFBa0M7QUFDbEMsSUFBSSxJQUFJLEdBQUcsSUFBSSxvQkFBUyxFQUFFLENBQUE7QUFDMUIsdUNBQWlDO0FBRTFCLEtBQUssVUFBVSxTQUFTLENBQUMsTUFBa0IsRUFBRSxTQUFjO0lBQ2hFLE9BQU8sTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxLQUFLLElBQUksRUFBRTtRQUNoRCxNQUFNLE1BQU0sR0FBRyxJQUFJLGlCQUFNLENBQUM7WUFDeEIsTUFBTTtTQUNQLENBQUMsQ0FBQTtRQUNGLE9BQU8sTUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQTtJQUNoQyxDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUM7QUFQRCw4QkFPQyJ9