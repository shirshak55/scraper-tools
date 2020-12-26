"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.csvToJson = void 0;
const csvtojson_1 = __importDefault(require("csvtojson"));
const async_lock_1 = __importDefault(require("async-lock"));
let lock = new async_lock_1.default();
async function csvToJson(path) {
    return await lock.acquire(path, async function () {
        return await csvtojson_1.default().fromFile(path);
    });
}
exports.csvToJson = csvToJson;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3N2VG9Kc29uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NzdlRvSnNvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSwwREFBMkI7QUFDM0IsNERBQWtDO0FBR2xDLElBQUksSUFBSSxHQUFHLElBQUksb0JBQVMsRUFBRSxDQUFBO0FBRW5CLEtBQUssVUFBVSxTQUFTLENBQUMsSUFBYztJQUM1QyxPQUFPLE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFjLEVBQUUsS0FBSztRQUM3QyxPQUFPLE1BQU0sbUJBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFjLENBQUMsQ0FBQTtJQUM3QyxDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUM7QUFKRCw4QkFJQyJ9