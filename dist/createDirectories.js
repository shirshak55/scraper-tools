"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
exports.default = (name) => {
    fs_extra_1.default.ensureDirSync(name);
    return name;
};
//# sourceMappingURL=createDirectories.js.map