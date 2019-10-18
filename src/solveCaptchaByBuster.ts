// this requires you to install buster extension
import delay from "delay"
import consoleMessage from "./consoleMessage"

export default async function(page) {
  let captchaFrame = null
  let tries = 0
  let bCaptchaFrame = null

  consoleMessage.info("Buster", "Start solving captcha")
  while (true) {
    captchaFrame = page
      .frames()
      .find((f: any) =>
        f.url().includes("https://www.google.com/recaptcha/api2/anchor")
      )
    if (captchaFrame) {
      break
    }

    if (tries > 200) {
      throw "cant find captcha frame"
      return
    }
    await delay(100)
  }
  console.log("Got captcha frame", captchaFrame.url())

  let captchaBtn = await captchaFrame.waitForSelector(
    "#recaptcha-anchor > div.recaptcha-checkbox-border",
    { visible: true }
  )

  captchaBtn.click()

  console.log(page.frames().map((v) => v.url()))

  while (true) {
    bCaptchaFrame = page
      .frames()
      .find((f: any) =>
        f.url().includes("https://www.google.com/recaptcha/api2/bframe")
      )
    if (bCaptchaFrame) {
      break
    }

    if (tries > 200) {
      throw "cant find buster captcha frame"
      return
    }
    await delay(100)
  }

  while (true) {
    const recaptchaSolveButton = await bCaptchaFrame.waitForSelector(
      "#solver-button",
      {
        visible: true
      }
    )
    await recaptchaSolveButton.click()

    try {
      await bCaptchaFrame.waitForSelector("#solver-button", {
        visible: true,
        timeout: 1000
      })
    } catch (e) {
      break
    }
  }
  consoleMessage.success("Buster", "Captcha should be solved")
}
