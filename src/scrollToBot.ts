import { Page } from "playwright"

export async function scrollToBottom(page: Page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      var totalHeight = 0
      var distance = 100
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight
        window.scrollBy(0, distance)
        totalHeight += distance

        if (totalHeight >= scrollHeight) {
          clearInterval(timer)
          resolve(null)
        }
      }, 30)
    })
  })
}
