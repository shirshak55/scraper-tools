"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
function createDirectories(name) {
    fs_extra_1.default.ensureDirSync(name);
    return name;
}
exports.createDirectories = createDirectories;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlRGlyZWN0b3JpZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvY3JlYXRlRGlyZWN0b3JpZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSx3REFBOEI7QUFFOUIsU0FBZ0IsaUJBQWlCLENBQUMsSUFBWTtJQUM1QyxrQkFBTyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUMzQixPQUFPLElBQUksQ0FBQTtBQUNiLENBQUM7QUFIRCw4Q0FHQyJ9