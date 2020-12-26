"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.waitForFrame = void 0;
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
exports.waitForFrame = waitForFrame;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FpdEZvckZyYW1lcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy93YWl0Rm9yRnJhbWVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLGtEQUF5QjtBQUdsQixLQUFLLFVBQVUsWUFBWSxDQUFDLElBQVUsRUFBRSxRQUFnQjtJQUM3RCxPQUFPLElBQUksRUFBRTtRQUNYLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFNLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQTtRQUNsRSxJQUFJLENBQUMsRUFBRTtZQUNMLE9BQU8sQ0FBQyxDQUFBO1NBQ1Q7UUFDRCxNQUFNLGVBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQTtLQUNqQjtBQUNILENBQUM7QUFSRCxvQ0FRQyJ9