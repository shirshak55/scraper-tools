// import puppeteer from 'puppeteer-core'
import chromePaths from 'chrome-paths'
import puppeteer from 'puppeteer-extra'
import pluginStealth from 'puppeteer-extra-plugin-stealth'
import pluginUAFix from 'puppeteer-extra-plugin-anonymize-ua'
import { Page, Browser } from 'puppeteer'
import RecaptchaPlugin from 'puppeteer-extra-plugin-recaptcha'

export default (() => {
  let defaultConfig = {
    browserHandle: null,
    proxy: null,
    headless: false,
    userDataDir: null,
    useChrome: false,
    windowSize: { width: 595, height: 842 },
    blockFonts: false,
    blockImages: false,
    blockCSS: false,
    defaultNavigationTimeout: 30 * 1000,
  }
  let config = {
    default: { ...defaultConfig },
  }

  let twoCaptchaToken: ''
  if (twoCaptchaToken) {
    const recaptchaPlugin = RecaptchaPlugin({
      provider: { id: '2captcha', token: twoCaptchaToken },
    })
    puppeteer.use(recaptchaPlugin)
  }

  puppeteer.use(pluginStealth())
  puppeteer.use(
    pluginUAFix({
      stripHeadless: true,
      makeWindows: true,
    }),
  )

  async function browser(name = 'default'): Promise<Browser> {
    let cfg = config[name]
    let browserHandle = cfg.browserHandle
    if (browserHandle) return browserHandle

    const args = [
      '--disable-infobars',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--ignore-certificate-errors',
      '--enable-features=NetworkService',
      `--window-size=${cfg.windowSize.width},${cfg.windowSize.height}`,
    ]

    if (cfg.proxy) {
      args.push(`--proxy-server=${cfg.proxy}`)
    }

    let launchOptions: any = {
      userDataDir: cfg.userDataDir,
      headless: cfg.headless,
      args,
      ignoreHTTPSErrors: true,
    }

    if (cfg.useChrome === true) {
      launchOptions.executablePath = chromePaths.chrome
    }

    browserHandle = await puppeteer.launch(launchOptions)
    return browserHandle
  }

  async function makePageFaster(page, name = 'default'): Promise<Page> {
    let cfg = config[name]
    if (cfg.blockCSS || cfg.blockFonts || cfg.blockImages) {
      await page.setRequestInterception(true)
      page.on('request', (request) => {
        if (
          (cfg.blockImages && request.resourceType() === 'image') ||
          (cfg.blockFonts && request.resourceType() === 'font') ||
          (cfg.blockCSS && request.resourceType() === 'stylesheet')
        ) {
          request.abort()
        } else {
          request.continue()
        }
      })
    }

    await page.target().createCDPSession()
    await page.setBypassCSP(true)
    await page.setDefaultNavigationTimeout(cfg.defaultNavigationTimeout)
    return page
  }

  return {
    newPage: async (uniqueName: string = 'default'): Promise<Page> => {
      let brow = await browser(uniqueName)
      let page = await brow.newPage()
      await makePageFaster(page, uniqueName)
      return page
    },
    closeBrowser: async (uniqueName: string = 'default') => {
      let browserHandle = config[uniqueName].browserHandle
      if (browserHandle) {
        let bHandle = await browser()
        await bHandle.close()
      }
      browserHandle = null
    },
    setProxy: (value: string, uniqueName: string = 'default') => {
      config[uniqueName].proxy = value
    },
    setHeadless: (value: boolean = false, uniqueName: string = 'default') => {
      config[uniqueName].headless = value
    },
    setUserDataDir: (value: string, uniqueName: string = 'default') => {
      config[uniqueName].userDataDir = value
    },
    setWindowSizeArg: (
      value: { width: number; height: number },
      uniqueName: string = 'default',
    ) => {
      config[uniqueName].windowSize = value
    },
    set2captchaToken: (value: string, uniqueName: string = 'default') => {
      config[uniqueName].twoCaptchaToken = value
    },
    setDefaultNavigationTimeout: (
      value: boolean,
      uniqueName: string = 'default',
    ) => {
      config[uniqueName].defaultNavigationTimeout = value
    },
    blockImages: (value: boolean = true, uniqueName: string = 'default') => {
      config[uniqueName].blockImages = value
    },
    blockFonts: (value: boolean = true, uniqueName: string = 'default') => {
      config[uniqueName].blockFonts = value
    },
    blockCSS: (value: boolean = true, uniqueName: string = 'default') => {
      config[uniqueName].blockCSS = value
    },
    useChrome: (value: boolean = true, uniqueName: string = 'default') => {
      config[uniqueName].useChrome = value
    },
  }
})()
