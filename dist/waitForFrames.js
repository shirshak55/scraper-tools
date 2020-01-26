"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const delay_1 = __importDefault(require("delay"));
async function waitForFrame(page, frameUrl) {
    while (true) {
        let f = page.frames().find((f) => f.url().includes(frameUrl));
        if (f) {
            return f;
        }
        await delay_1.default(100);
    }
}
exports.default = waitForFrame;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FpdEZvckZyYW1lcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy93YWl0Rm9yRnJhbWVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsa0RBQXlCO0FBR1YsS0FBSyxVQUFVLFlBQVksQ0FBQyxJQUFVLEVBQUUsUUFBZ0I7SUFDckUsT0FBTyxJQUFJLEVBQUU7UUFDWCxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUE7UUFDbEUsSUFBSSxDQUFDLEVBQUU7WUFDTCxPQUFPLENBQUMsQ0FBQTtTQUNUO1FBQ0QsTUFBTSxlQUFLLENBQUMsR0FBRyxDQUFDLENBQUE7S0FDakI7QUFDSCxDQUFDO0FBUkQsK0JBUUMifQ==