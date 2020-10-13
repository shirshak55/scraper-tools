"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../");
async function main() {
    let page = await __1.fastPage().newPage();
    await page.goto("https://intoli.com/");
}
main().catch((e) => {
    console.error(e);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RlYWx0aFRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9leGFtcGxlcy9zdGVhbHRoVGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDJCQUE4QjtBQUU5QixLQUFLLFVBQVUsSUFBSTtJQUNqQixJQUFJLElBQUksR0FBRyxNQUFNLFlBQVEsRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFBO0lBRXJDLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxDQUFBO0FBQ3hDLENBQUM7QUFFRCxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtJQUNqQixPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ2xCLENBQUMsQ0FBQyxDQUFBIn0=