"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const csvtojson_1 = __importDefault(require("csvtojson"));
const async_lock_1 = __importDefault(require("async-lock"));
let lock = new async_lock_1.default();
exports.default = async (path) => {
    return await lock.acquire(path, async function () {
        return await csvtojson_1.default().fromFile(path);
    });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3N2VG9Kc29uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NzdlRvSnNvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDBEQUE0QjtBQUM1Qiw0REFBbUM7QUFHbkMsSUFBSSxJQUFJLEdBQUcsSUFBSSxvQkFBUyxFQUFFLENBQUM7QUFFM0Isa0JBQWUsS0FBSyxFQUFFLElBQWMsRUFBRSxFQUFFO0lBQ3RDLE9BQU8sTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQWMsRUFBRSxLQUFLO1FBQzdDLE9BQU8sTUFBTSxtQkFBRyxFQUFFLENBQUMsUUFBUSxDQUFDLElBQWMsQ0FBQyxDQUFDO0lBQzlDLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDIn0=