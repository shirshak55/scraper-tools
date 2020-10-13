import { BrowserContext, Page } from 'playwright'
import utils from './utils'

// https://github.com/berstend/puppeteer-extra/blob/master/packages/puppeteer-extra-plugin-stealth/evasions/_utils/withUtils.js


export async function withUtilsEvaluate(page: Page, mainFunction, ...args) {
    return page.evaluate(
      ({ _utilsFns, _mainFunction, _args }) => {
        // Add this point we cannot use our utililty functions as they're just strings, we need to materialize them first
        const utils = Object.fromEntries(
          Object.entries(_utilsFns).map(([key, value]) => [key, eval(value as string)])
        )
        utils.preloadCache()
        return eval(_mainFunction)(utils, ..._args)
      },
      {
        _utilsFns: utils.stringifyFns(utils),
        _mainFunction: mainFunction.toString(),
        _args: args || []
      }
    )
}



export async function withUtilsInitScript(context:BrowserContext, mainFunction, ...args) {
    return context.addInitScript(
      ({ _utilsFns, _mainFunction, _args }) => {
        // Add this point we cannot use our utililty functions as they're just strings, we need to materialize them first
        const utils = Object.fromEntries(
          Object.entries(_utilsFns).map(([key, value]) => [key, eval(value as string)])
        )
        utils.preloadCache()
        return eval(_mainFunction)(utils, ..._args)
      },
      {
        _utilsFns: utils.stringifyFns(utils),
        _mainFunction: mainFunction.toString(),
        _args: args || []
      }
    )
  }
