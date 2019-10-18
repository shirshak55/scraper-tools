import delay from "delay"
import consoleMessage from "./consoleMessage"
import waitForFrames from "./waitForFrames"

async function getCaptchaFrame(page) {
  return await waitForFrames(
    page,
    "https://www.google.com/recaptcha/api2/anchor"
  )
}

async function getBusterCaptchaFrame(page) {
  return await waitForFrames(
    page,
    "https://www.google.com/recaptcha/api2/bframe"
  )
}

async function solver(page) {
  consoleMessage.success("Buster", "Clicking on captcha btn")

  let captchaFrame = await getCaptchaFrame(page)
  await (await captchaFrame.waitForSelector(
    "#recaptcha-anchor > div.recaptcha-checkbox-border",
    { visible: true }
  )).click()

  consoleMessage.success("Buster", "Waiting for buster frames")
  let bCaptchaFrame = await getBusterCaptchaFrame(page)
  consoleMessage.success("Buster", "Clicking on buster solver icon")

  while (true) {
    try {
      const recaptchaSolveButton = await bCaptchaFrame.waitForSelector(
        "#solver-button",
        {
          visible: true,
          timeout: 1000
        }
      )
      await recaptchaSolveButton.click()
    } catch (e) {
      break
    }
  }

  try {
    const recaptchaReload = await bCaptchaFrame.waitForSelector(
      "#reset-button",
      {
        visible: true,
        timeout: 500
      }
    )
    await recaptchaReload.click()
  } catch (e) {}
}

export default async function(page) {
  while (true) {
    console.log("ssss")
    await solver(page)

    console.log("get captcha frame")

    // Checks if captcha was really solved
    try {
      let captchaFrame = await getCaptchaFrame(page)
      let captchaClasses = await captchaFrame.evaluate(() => {
        if (document.querySelector(".recaptcha-checkbox")) {
          return document.querySelector(".recaptcha-checkbox").className
        }
        return false
      })
      if (captchaClasses.includes("recaptcha-checkbox-checked")) {
        break
      }
    } catch (e) {}
    await delay(1000)
  }

  // Check For Reload

  consoleMessage.success("Buster", "Captcha should be solved")
}
