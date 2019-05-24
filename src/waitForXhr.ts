import pWaitFor from 'p-wait-for'
import pendingXHR from 'pending-xhr-puppeteer'

export default async (page, no_of_xhr_request = 1) => {
  const p = new pendingXHR(page)
  await Promise.all([
    pWaitFor(() => p.finishedWithSuccessXhrs.size >= no_of_xhr_request),
    pendingXHR.waitForAllXhrFinished(),
  ])
}
