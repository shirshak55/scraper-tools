import { Page } from "playwright"
import _ from "lodash"
import AsyncLock from "async-lock"

let lock = new AsyncLock({ maxPending: 5000 })

let hooks: Array<(page: Page, config: any) => any> = []

export async function browserRequest(page: Page, config: any = {}) {
  for (let hook of hooks) {
    await hook(page, config)
  }

  if (!config.url) {
    throw "URL is not given. Please provide Url"
  }

  let defaultCfg: any = {
    credentials: "include",
    headers: {},
    body: null,
    redirect: "follow",
    mode: "cors",
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

// Async just in case in future we need to add some await here
export async function addBrowserRequestHooks(func: (page: Page, config: any) => any) {
  hooks.push(func)
}

export async function singleBrowserRequest(page: Page, config: any = {}) {
  return await lock.acquire("singleBrowserRequest", async function singleBrowserRequestLock() {
    return await browserRequest(page, config)
  })
}

let concurrentRequestId = 0
export async function concurrentBrowserRequest(page: Page, concurrency: number, config: any = {}) {
  concurrentRequestId = (concurrentRequestId + 1) % concurrency

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
