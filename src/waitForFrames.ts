import delay from 'delay'

export default async function waitForFrame(page, frameName) {
  while (true) {
    let f = page.frames().find((f) => f.url().indexOf(frameName) > 0)
    if (f) {
      return true
    }
    await delay(100)
  }
}
