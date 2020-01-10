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
exports.default = parseToml;
//# sourceMappingURL=parseToml.js.map