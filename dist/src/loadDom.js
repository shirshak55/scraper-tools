"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadDom = void 0;
const cheerio_1 = __importDefault(require("cheerio"));
const consoleMessage_1 = require("./consoleMessage");
function loadDom(dom) {
    try {
        return cheerio_1.default.load(dom);
    }
    catch (e) {
        consoleMessage_1.consoleMessage.error("Load Dom", "Error from loadDom", e);
        throw e;
    }
}
exports.loadDom = loadDom;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9hZERvbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9sb2FkRG9tLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHNEQUE2QjtBQUM3QixxREFBaUQ7QUFFakQsU0FBZ0IsT0FBTyxDQUFDLEdBQVE7SUFDOUIsSUFBSTtRQUNGLE9BQU8saUJBQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUE7S0FDekI7SUFBQyxPQUFPLENBQUMsRUFBRTtRQUNWLCtCQUFjLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRSxvQkFBb0IsRUFBRSxDQUFDLENBQUMsQ0FBQTtRQUN6RCxNQUFNLENBQUMsQ0FBQTtLQUNSO0FBQ0gsQ0FBQztBQVBELDBCQU9DIn0=