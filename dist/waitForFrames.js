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
exports.waitForFrame = waitForFrame;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FpdEZvckZyYW1lcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy93YWl0Rm9yRnJhbWVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsa0RBQXlCO0FBR2xCLEtBQUssVUFBVSxZQUFZLENBQUMsSUFBVSxFQUFFLFFBQWdCO0lBQzdELE9BQU8sSUFBSSxFQUFFO1FBQ1gsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQU0sRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFBO1FBQ2xFLElBQUksQ0FBQyxFQUFFO1lBQ0wsT0FBTyxDQUFDLENBQUE7U0FDVDtRQUNELE1BQU0sZUFBSyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0tBQ2pCO0FBQ0gsQ0FBQztBQVJELG9DQVFDIn0=