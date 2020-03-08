"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const toml_1 = __importDefault(require("toml"));
const fs_1 = __importDefault(require("fs"));
function parseToml(path) {
    return toml_1.default.parse(fs_1.default.readFileSync(path).toString());
}
exports.parseToml = parseToml;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2VUb21sLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3BhcnNlVG9tbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLGdEQUF1QjtBQUN2Qiw0Q0FBaUM7QUFFakMsU0FBZ0IsU0FBUyxDQUFDLElBQWM7SUFDdEMsT0FBTyxjQUFJLENBQUMsS0FBSyxDQUFDLFlBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQTtBQUNyRCxDQUFDO0FBRkQsOEJBRUMifQ==