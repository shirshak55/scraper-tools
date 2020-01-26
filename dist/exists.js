"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
const fs_1 = __importDefault(require("fs"));
const stat = util_1.promisify(fs_1.default.stat);
async function default_1(filePath) {
    try {
        await stat(filePath);
        return true;
    }
    catch (err) {
        return false;
    }
}
exports.default = default_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhpc3RzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2V4aXN0cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUNBLCtCQUFpQztBQUNqQyw0Q0FBb0I7QUFFcEIsTUFBTSxJQUFJLEdBQUcsZ0JBQVMsQ0FBQyxZQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7QUFFakIsS0FBSyxvQkFBVSxRQUFrQjtJQUM5QyxJQUFJO1FBQ0YsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDckIsT0FBTyxJQUFJLENBQUM7S0FDYjtJQUFDLE9BQU8sR0FBRyxFQUFFO1FBQ1osT0FBTyxLQUFLLENBQUM7S0FDZDtBQUNILENBQUM7QUFQRCw0QkFPQyJ9