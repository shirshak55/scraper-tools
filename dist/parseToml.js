"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseToml = void 0;
var toml_1 = __importDefault(require("toml"));
var fs_1 = __importDefault(require("fs"));
function parseToml(path) {
    return toml_1.default.parse(fs_1.default.readFileSync(path).toString());
}
exports.parseToml = parseToml;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2VUb21sLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3BhcnNlVG9tbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSw4Q0FBdUI7QUFDdkIsMENBQWlDO0FBRWpDLFNBQWdCLFNBQVMsQ0FBQyxJQUFjO0lBQ3RDLE9BQU8sY0FBSSxDQUFDLEtBQUssQ0FBQyxZQUFFLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUE7QUFDckQsQ0FBQztBQUZELDhCQUVDIn0=