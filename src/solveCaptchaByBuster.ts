// this requires you to install buster extension
import delay from "delay"

export default async function(page) {
  let captchaFrame = null
  let tries = 0

  while (true) {
    captchaFrame = page
      .frames()
      .find((f: any) => f.url().includes("www.google.com/recaptcha/api2") > 0)
    if (captchaFrame) {
      break
    }

    if (tries > 200) {
      throw "cant find captcha frame"
      return
    }
    await delay(100)
  }

  // to click we can use following code
  // let captchaClickHandler = await captchaFrame.waitForSelector(
  //   "#recaptcha-anchor > div.recaptcha-checkbox-border",
  //   { visible: true }
  // )

  // captchaClickHandler.click()

  const recaptchaSolveButton = await captchaFrame.waitForSelector(
    "#solver-button",
    {
      visible: true
    }
  )
  await recaptchaSolveButton.click()
}
