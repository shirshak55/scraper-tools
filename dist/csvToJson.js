"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const csvtojson_1 = __importDefault(require("csvtojson"));
const async_lock_1 = __importDefault(require("async-lock"));
let lock = new async_lock_1.default();
async function csvToJson(path) {
    return await lock.acquire(path, async function () {
        return await csvtojson_1.default().fromFile(path);
    });
}
exports.csvToJson = csvToJson;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3N2VG9Kc29uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NzdlRvSnNvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDBEQUEyQjtBQUMzQiw0REFBa0M7QUFHbEMsSUFBSSxJQUFJLEdBQUcsSUFBSSxvQkFBUyxFQUFFLENBQUE7QUFFbkIsS0FBSyxVQUFVLFNBQVMsQ0FBQyxJQUFjO0lBQzVDLE9BQU8sTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQWMsRUFBRSxLQUFLO1FBQzdDLE9BQU8sTUFBTSxtQkFBRyxFQUFFLENBQUMsUUFBUSxDQUFDLElBQWMsQ0FBQyxDQUFBO0lBQzdDLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQztBQUpELDhCQUlDIn0=