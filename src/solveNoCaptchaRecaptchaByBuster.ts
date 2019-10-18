import waitForFrames from "./waitForFrames"

export default async function(page) {
  let frame = await waitForFrames(page, "recaptcha/api2/bframe")
  const recaptchaSolveButton = await frame.waitForSelector("#solver-button", {
    visible: true
  })
  await recaptchaSolveButton.click()
}
