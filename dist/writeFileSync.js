"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const consoleMessage_1 = __importDefault(require("./consoleMessage"));
exports.default = (fileName, content) => {
    try {
        fs_1.default.writeFileSync(fileName, content);
    }
    catch (e) {
        consoleMessage_1.default.error("Error while writing file:::", e);
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid3JpdGVGaWxlU3luYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy93cml0ZUZpbGVTeW5jLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsNENBQW9CO0FBQ3BCLHNFQUE4QztBQUU5QyxrQkFBZSxDQUFDLFFBQWdCLEVBQUUsT0FBd0IsRUFBRSxFQUFFO0lBQzVELElBQUk7UUFDRixZQUFFLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztLQUNyQztJQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ1Ysd0JBQWMsQ0FBQyxLQUFLLENBQUMsNkJBQTZCLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDeEQ7QUFDSCxDQUFDLENBQUMifQ==