"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const waitForFrames_1 = __importDefault(require("./waitForFrames"));
async function default_1(page) {
    let frame = await waitForFrames_1.default(page, "recaptcha/api2/bframe");
    const recaptchaSolveButton = await frame.waitForSelector("#solver-button", {
        visible: true
    });
    await recaptchaSolveButton.click();
}
exports.default = default_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29sdmVOb0NhcHRjaGFSZWNhcHRjaGFCeUJ1c3Rlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9zb2x2ZU5vQ2FwdGNoYVJlY2FwdGNoYUJ5QnVzdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsb0VBQTJDO0FBRTVCLEtBQUssb0JBQVUsSUFBSTtJQUNoQyxJQUFJLEtBQUssR0FBRyxNQUFNLHVCQUFhLENBQUMsSUFBSSxFQUFFLHVCQUF1QixDQUFDLENBQUE7SUFDOUQsTUFBTSxvQkFBb0IsR0FBRyxNQUFNLEtBQUssQ0FBQyxlQUFlLENBQUMsZ0JBQWdCLEVBQUU7UUFDekUsT0FBTyxFQUFFLElBQUk7S0FDZCxDQUFDLENBQUE7SUFDRixNQUFNLG9CQUFvQixDQUFDLEtBQUssRUFBRSxDQUFBO0FBQ3BDLENBQUM7QUFORCw0QkFNQyJ9