import { Page } from "puppeteer"

async function getRecaptchaSolutions(
  captchas: types.CaptchaInfo[],
  provider?: types.SolutionProvider
) {
  this.debug("getRecaptchaSolutions")
  provider = provider || this.opts.provider
  if (!provider || (!provider.token && !provider.fn)) {
    throw new Error("Please provide a solution provider to the plugin.")
  }
  let fn = provider.fn
  if (!fn) {
    const builtinProvider = BuiltinSolutionProviders.find(
      (p) => p.id === (provider || {}).id
    )
    if (!builtinProvider || !builtinProvider.fn) {
      throw new Error(`Cannot find builtin provider with id '${provider.id}'.`)
    }
    fn = builtinProvider.fn
  }
  const response = await fn.call(this, captchas, provider.token)
  response.error =
    response.error ||
    response.solutions.find((s: types.CaptchaSolution) => !!s.error)
  this.debug("getRecaptchaSolutions", response)
  if (this.opts.throwOnError && response.error) {
    throw new Error(response.error)
  }
  return response
}

async function enterRecaptchaSolutions(
  page: Page,
  solutions: types.CaptchaSolution[]
) {
  this.debug("enterRecaptchaSolutions")
  const response: types.EnterRecaptchaSolutionsResult = await page.evaluate(
    this._generateContentScript("enterRecaptchaSolutions", { solutions })
  )
  response.error = response.error || response.solved.find((s) => !!s.error)
  this.debug("enterRecaptchaSolutions", response)
  if (this.opts.throwOnError && response.error) {
    throw new Error(response.error)
  }
  return response
}

async function solveRecaptchas(
  page: Page
): Promise<types.SolveRecaptchasResult> {
  this.debug("solveRecaptchas")
  const response: types.SolveRecaptchasResult = {
    captchas: [],
    solutions: [],
    solved: [],
    error: null
  }
  try {
    // If `this.opts.throwOnError` is set any of the
    // following will throw and abort execution.
    const { captchas, error: captchasError } = await this.findRecaptchas(page)
    response.captchas = captchas

    if (captchas.length) {
      const {
        solutions,
        error: solutionsError
      } = await this.getRecaptchaSolutions(response.captchas)
      response.solutions = solutions

      const { solved, error: solvedError } = await this.enterRecaptchaSolutions(
        page,
        response.solutions
      )
      response.solved = solved

      response.error = captchasError || solutionsError || solvedError
    }
  } catch (error) {
    response.error = error.toString()
  }
  this.debug("solveRecaptchas", response)
  if (this.opts.throwOnError && response.error) {
    throw new Error(response.error)
  }
  return response
}

async function findRecaptchas(page: Page) {
  const hasRecaptchaScriptTag = await page.$(
    `script[src="https://www.google.com/recaptcha/api.js"]`
  )
  if (hasRecaptchaScriptTag) {
    await page.waitForFunction(
      `
        (function() {
          return window.___grecaptcha_cfg && window.___grecaptcha_cfg.count
        })()
      `,
      { polling: 200, timeout: 10 * 1000 }
    )
  }
  const response = await page.evaluate(
    this._generateContentScript("findRecaptchas")
  )

  if (response.error) {
    throw new Error(response.error)
  }

  return response
}

export default async function solver(
  page: Page,
  provider = "2captcha",
  apiKey
) {}
