"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cheerio_1 = __importDefault(require("cheerio"));
const consoleMessage_1 = __importDefault(require("./consoleMessage"));
function default_1(dom) {
    try {
        return cheerio_1.default.load(dom);
    }
    catch (e) {
        consoleMessage_1.default.error("Load Dom", "Error from loadDom", e);
        throw e;
    }
}
exports.default = default_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9hZERvbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9sb2FkRG9tLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsc0RBQThCO0FBQzlCLHNFQUE4QztBQUU5QyxtQkFBd0IsR0FBUTtJQUM5QixJQUFJO1FBQ0YsT0FBTyxpQkFBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUMxQjtJQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ1Ysd0JBQWMsQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLG9CQUFvQixFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzFELE1BQU0sQ0FBQyxDQUFDO0tBQ1Q7QUFDSCxDQUFDO0FBUEQsNEJBT0MifQ==