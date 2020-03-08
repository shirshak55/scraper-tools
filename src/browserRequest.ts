import { Page } from "puppeteer"
import _ from "lodash"
import AsyncLock from "async-lock"

let lock = new AsyncLock({ maxPending: 5000 })

export async function browserRequest(page: Page, config: any = {}) {
  if (!config.url) {
    throw "URL is not given. Please provide Url"
  }

  let defaultCfg: any = {
    credentials: "include",
    headers: {},
    body: null,
    redirect: "follow",
    mode: "cors"
  }

  if (!config.method) {
    defaultCfg.method = "GET"
  }

  let fetchConfig = _.merge({}, defaultCfg, config)

  let evaluated = await page.evaluate(async (fetchConfig) => {
    let res = await fetch(fetchConfig.url, fetchConfig)
    let toRet = await res.text()
    return toRet
  }, fetchConfig)
  return evaluated
}

export async function singleBrowserRequest(page: Page, config: any = {}) {
  return await lock.acquire("singleBrowserRequest", async function singleBrowserRequestLock() {
    return await browserRequest(page, config)
  })
}

let concurrentRequestId = 0
export async function concurrentBrowserRequest(page: Page, concurrency: number, config: any = {}) {
  concurrentRequestId = (concurrentRequestId + 1) % concurrency

  console.log(concurrentRequestId)
  return await lock.acquire(
    "singleBrowserRequest" + concurrentRequestId,
    async function singleBrowserRequestLock() {
      return await browserRequest(page, config)
    }
  )
}

export async function jsonBrowserRequest(a: Page, b: any) {
  if (!b.headers) {
    b.headers = {}
  }

  b.headers["content-type"] = "application/json;charset=UTF-8"

  return browserRequest(a, b)
}
