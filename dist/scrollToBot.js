"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrollToBottom = void 0;
async function scrollToBottom(page) {
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;
                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve(null);
                }
            }, 30);
        });
    });
}
exports.scrollToBottom = scrollToBottom;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Nyb2xsVG9Cb3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvc2Nyb2xsVG9Cb3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRU8sS0FBSyxVQUFVLGNBQWMsQ0FBQyxJQUFVO0lBQzdDLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLElBQUksRUFBRTtRQUM3QixNQUFNLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUU7WUFDNUIsSUFBSSxXQUFXLEdBQUcsQ0FBQyxDQUFBO1lBQ25CLElBQUksUUFBUSxHQUFHLEdBQUcsQ0FBQTtZQUNsQixJQUFJLEtBQUssR0FBRyxXQUFXLENBQUMsR0FBRyxFQUFFO2dCQUMzQixJQUFJLFlBQVksR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQTtnQkFDN0MsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUE7Z0JBQzVCLFdBQVcsSUFBSSxRQUFRLENBQUE7Z0JBRXZCLElBQUksV0FBVyxJQUFJLFlBQVksRUFBRTtvQkFDL0IsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFBO29CQUNwQixPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7aUJBQ2Q7WUFDSCxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUE7UUFDUixDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQztBQWpCRCx3Q0FpQkMifQ==