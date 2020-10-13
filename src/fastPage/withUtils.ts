import { BrowserContext, Page } from "playwright"
import utils from "./utils"

// https://github.com/berstend/puppeteer-extra/blob/master/packages/puppeteer-extra-plugin-stealth/evasions/_utils/withUtils.js

export async function withUtilsEvaluate(page: Page, mainFunction: any, ...args: any[]) {
  return page.evaluate(
    ({ _utilsFns, _mainFunction, _args }: { _utilsFns: any; _mainFunction: any; _args: any }) => {
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
      _args: args || [],
    }
  )
}

export async function withUtilsInitScript(
  context: BrowserContext,
  mainFunction: any,
  ...args: any[]
) {
  return context.addInitScript(
    ({ _utilsFns, _mainFunction, _args }: { _utilsFns: any; _mainFunction: any; _args: any }) => {
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
      _args: args || [],
    }
  )
}
