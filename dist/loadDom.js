"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9hZERvbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9sb2FkRG9tLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsc0RBQTZCO0FBQzdCLHFEQUFpRDtBQUVqRCxTQUFnQixPQUFPLENBQUMsR0FBUTtJQUM5QixJQUFJO1FBQ0YsT0FBTyxpQkFBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQTtLQUN6QjtJQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ1YsK0JBQWMsQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLG9CQUFvQixFQUFFLENBQUMsQ0FBQyxDQUFBO1FBQ3pELE1BQU0sQ0FBQyxDQUFBO0tBQ1I7QUFDSCxDQUFDO0FBUEQsMEJBT0MifQ==