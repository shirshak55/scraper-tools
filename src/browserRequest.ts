import { Page } from 'puppeteer'
import _ from 'lodash'

export default async function browserRequest(page: Page, config: any = {}) {
  if (!config.url) {
    throw 'URL is not given. Please provide Url'
  }

  let defaultCfg: any = {
    credentials: 'include',
    headers: {},
    body: null,
    redirect: 'follow',
    mode: 'cors'
  }

  if (!config.method) {
    defaultCfg.method = 'GET'
  }

  let fetchConfig = _.merge({}, defaultCfg, config)

  let evaluated = await page.evaluate(async (url, method) => {
    console.log('start--------------------------------------------------------------------------')
    console.log('Sending Request to url', url, method)

    let res = await fetch(fetchConfig.url, fetchConfig)
    let toRet = res.text()
    console.log(toRet)
    console.log('end--------------------------------------------------------------------------')
    return toRet
  }, fetchConfig)
  return evaluated
}
