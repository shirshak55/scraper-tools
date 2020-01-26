"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const delay_1 = __importDefault(require("delay"));
const consoleMessage_1 = __importDefault(require("./consoleMessage"));
const waitForFrames_1 = __importDefault(require("./waitForFrames"));
async function getCaptchaFrame(page) {
    return await waitForFrames_1.default(page, "https://www.google.com/recaptcha/api2/anchor");
}
async function getBusterCaptchaFrame(page) {
    return await waitForFrames_1.default(page, "https://www.google.com/recaptcha/api2/bframe");
}
async function solver(page) {
    consoleMessage_1.default.success("Buster", "Clicking on captcha btn");
    let captchaFrame = await getCaptchaFrame(page);
    await (await captchaFrame.waitForSelector("#recaptcha-anchor > div.recaptcha-checkbox-border", { visible: true })).click();
    consoleMessage_1.default.success("Buster", "Waiting for buster frames");
    let bCaptchaFrame = await getBusterCaptchaFrame(page);
    consoleMessage_1.default.success("Buster", "Clicking on buster solver icon");
    while (true) {
        try {
            const recaptchaSolveButton = await bCaptchaFrame.waitForSelector("#solver-button", {
                visible: true,
                timeout: 1000
            });
            await recaptchaSolveButton.click();
        }
        catch (e) {
            break;
        }
    }
    try {
        const recaptchaReload = await bCaptchaFrame.waitForSelector("#reset-button", {
            visible: true,
            timeout: 500
        });
        await recaptchaReload.click();
    }
    catch (e) { }
}
async function default_1(page) {
    while (true) {
        console.log("ssss");
        await solver(page);
        console.log("get captcha frame");
        try {
            let captchaFrame = await getCaptchaFrame(page);
            let captchaClasses = await captchaFrame.evaluate(() => {
                if (document.querySelector(".recaptcha-checkbox")) {
                    return document.querySelector(".recaptcha-checkbox").className;
                }
                return false;
            });
            if (captchaClasses.includes("recaptcha-checkbox-checked")) {
                break;
            }
        }
        catch (e) { }
        await delay_1.default(1000);
    }
    consoleMessage_1.default.success("Buster", "Captcha should be solved");
}
exports.default = default_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29sdmVDYXB0Y2hhQnlCdXN0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvc29sdmVDYXB0Y2hhQnlCdXN0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxrREFBeUI7QUFDekIsc0VBQTZDO0FBQzdDLG9FQUEyQztBQUUzQyxLQUFLLFVBQVUsZUFBZSxDQUFDLElBQUk7SUFDakMsT0FBTyxNQUFNLHVCQUFhLENBQ3hCLElBQUksRUFDSiw4Q0FBOEMsQ0FDL0MsQ0FBQTtBQUNILENBQUM7QUFFRCxLQUFLLFVBQVUscUJBQXFCLENBQUMsSUFBSTtJQUN2QyxPQUFPLE1BQU0sdUJBQWEsQ0FDeEIsSUFBSSxFQUNKLDhDQUE4QyxDQUMvQyxDQUFBO0FBQ0gsQ0FBQztBQUVELEtBQUssVUFBVSxNQUFNLENBQUMsSUFBSTtJQUN4Qix3QkFBYyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUseUJBQXlCLENBQUMsQ0FBQTtJQUUzRCxJQUFJLFlBQVksR0FBRyxNQUFNLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUM5QyxNQUFNLENBQUMsTUFBTSxZQUFZLENBQUMsZUFBZSxDQUN2QyxtREFBbUQsRUFDbkQsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQ2xCLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtJQUVWLHdCQUFjLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSwyQkFBMkIsQ0FBQyxDQUFBO0lBQzdELElBQUksYUFBYSxHQUFHLE1BQU0scUJBQXFCLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDckQsd0JBQWMsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLGdDQUFnQyxDQUFDLENBQUE7SUFFbEUsT0FBTyxJQUFJLEVBQUU7UUFDWCxJQUFJO1lBQ0YsTUFBTSxvQkFBb0IsR0FBRyxNQUFNLGFBQWEsQ0FBQyxlQUFlLENBQzlELGdCQUFnQixFQUNoQjtnQkFDRSxPQUFPLEVBQUUsSUFBSTtnQkFDYixPQUFPLEVBQUUsSUFBSTthQUNkLENBQ0YsQ0FBQTtZQUNELE1BQU0sb0JBQW9CLENBQUMsS0FBSyxFQUFFLENBQUE7U0FDbkM7UUFBQyxPQUFPLENBQUMsRUFBRTtZQUNWLE1BQUs7U0FDTjtLQUNGO0lBRUQsSUFBSTtRQUNGLE1BQU0sZUFBZSxHQUFHLE1BQU0sYUFBYSxDQUFDLGVBQWUsQ0FDekQsZUFBZSxFQUNmO1lBQ0UsT0FBTyxFQUFFLElBQUk7WUFDYixPQUFPLEVBQUUsR0FBRztTQUNiLENBQ0YsQ0FBQTtRQUNELE1BQU0sZUFBZSxDQUFDLEtBQUssRUFBRSxDQUFBO0tBQzlCO0lBQUMsT0FBTyxDQUFDLEVBQUUsR0FBRTtBQUNoQixDQUFDO0FBRWMsS0FBSyxvQkFBVSxJQUFJO0lBQ2hDLE9BQU8sSUFBSSxFQUFFO1FBQ1gsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUNuQixNQUFNLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUVsQixPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLENBQUE7UUFHaEMsSUFBSTtZQUNGLElBQUksWUFBWSxHQUFHLE1BQU0sZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFBO1lBQzlDLElBQUksY0FBYyxHQUFHLE1BQU0sWUFBWSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUU7Z0JBQ3BELElBQUksUUFBUSxDQUFDLGFBQWEsQ0FBQyxxQkFBcUIsQ0FBQyxFQUFFO29CQUNqRCxPQUFPLFFBQVEsQ0FBQyxhQUFhLENBQUMscUJBQXFCLENBQUMsQ0FBQyxTQUFTLENBQUE7aUJBQy9EO2dCQUNELE9BQU8sS0FBSyxDQUFBO1lBQ2QsQ0FBQyxDQUFDLENBQUE7WUFDRixJQUFJLGNBQWMsQ0FBQyxRQUFRLENBQUMsNEJBQTRCLENBQUMsRUFBRTtnQkFDekQsTUFBSzthQUNOO1NBQ0Y7UUFBQyxPQUFPLENBQUMsRUFBRSxHQUFFO1FBQ2QsTUFBTSxlQUFLLENBQUMsSUFBSSxDQUFDLENBQUE7S0FDbEI7SUFJRCx3QkFBYyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsMEJBQTBCLENBQUMsQ0FBQTtBQUM5RCxDQUFDO0FBMUJELDRCQTBCQyJ9