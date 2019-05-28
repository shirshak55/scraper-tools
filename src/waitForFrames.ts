export default function waitForFrame(page, frameName) {
  let fulfill
  const promise = new Promise((x) => (fulfill = x))
  checkFrame()
  return promise

  function checkFrame() {
    const frame = page.frames().find((f) => f.url().indexOf(frameName) > 0)
    if (frame) fulfill(frame)
    else page.once('frameattached', checkFrame)
  }
}
