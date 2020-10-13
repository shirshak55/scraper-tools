"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrollToBottom = void 0;
async function scrollToBottom(page) {
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;
                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 30);
        });
    });
}
exports.scrollToBottom = scrollToBottom;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Nyb2xsVG9Cb3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc2Nyb2xsVG9Cb3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRU8sS0FBSyxVQUFVLGNBQWMsQ0FBQyxJQUFVO0lBQzdDLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLElBQUksRUFBRTtRQUM3QixNQUFNLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1lBQ3BDLElBQUksV0FBVyxHQUFHLENBQUMsQ0FBQTtZQUNuQixJQUFJLFFBQVEsR0FBRyxHQUFHLENBQUE7WUFDbEIsSUFBSSxLQUFLLEdBQUcsV0FBVyxDQUFDLEdBQUcsRUFBRTtnQkFDM0IsSUFBSSxZQUFZLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUE7Z0JBQzdDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFBO2dCQUM1QixXQUFXLElBQUksUUFBUSxDQUFBO2dCQUV2QixJQUFJLFdBQVcsSUFBSSxZQUFZLEVBQUU7b0JBQy9CLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQTtvQkFDcEIsT0FBTyxFQUFFLENBQUE7aUJBQ1Y7WUFDSCxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUE7UUFDUixDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQztBQWpCRCx3Q0FpQkMifQ==