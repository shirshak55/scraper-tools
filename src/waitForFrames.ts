import delay from "delay"

export default async function waitForFrame(page, frameUrl) {
  while (true) {
    let f = page.frames().find((f) => f.url().includes(frameUrl))
    if (f) {
      return f
    }
    await delay(100)
  }
}
