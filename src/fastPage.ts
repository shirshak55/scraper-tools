// import puppeteer from 'puppeteer-core'
import chromePaths from 'chrome-paths'
import puppeteer from 'puppeteer-extra'
import pluginStealth from 'puppeteer-extra-plugin-stealth'
import pluginUAFix from 'puppeteer-extra-plugin-anonymize-ua'
import { Page, Browser } from 'puppeteer'
import RecaptchaPlugin from 'puppeteer-extra-plugin-recaptcha'
import AsyncLock from 'async-lock'

export default (() => {
  let lock = new AsyncLock()

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
    extensions: [],
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
    return await lock.acquire('instance_' + name, async function() {
      let cfg = config[name]
      if (cfg.browserHandle) return cfg.browserHandle

      const args = [
        '--disable-infobars',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--ignore-certificate-errors',
        '--enable-features=NetworkService',
        `--window-size=${cfg.windowSize.width},${cfg.windowSize.height}`,
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
      ]

      if (cfg.proxy) {
        args.push(`--proxy-server=${cfg.proxy}`)
      }

      if (cfg.extensions.length > 0) {
        for (let p of cfg.extensions) {
          args.push(`--disable-extensions-except=${p}`, `--load-extension=${p}`)
        }
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

      cfg.browserHandle = await puppeteer.launch(launchOptions)
      return cfg.browserHandle
    })
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

    const session = await page.target().createCDPSession()
    await page.setBypassCSP(true)
    await session.send('Page.enable')
    await session.send('Page.setWebLifecycleState', { state: 'active' })
    await page.setDefaultNavigationTimeout(cfg.defaultNavigationTimeout)
    return page
  }

  return {
    init: async (instanceName: string, useCurrentDefaultConfig = false) => {
      if (useCurrentDefaultConfig) {
        config[instanceName] = { ...config.default }
      } else {
        config[instanceName] = { ...defaultConfig }
      }
    },
    newPage: async (instanceName: string = 'default'): Promise<Page> => {
      let brow = await browser(instanceName)
      let page = await brow.newPage()
      await makePageFaster(page, instanceName)
      return page
    },
    closeBrowser: async (instanceName: string = 'default') => {
      return await lock.acquire('instance_' + instanceName, async function() {
        let browserHandle = config[instanceName].browserHandle
        if (browserHandle) {
          let bHandle = await browser()
          await bHandle.close()
        }
        browserHandle = null
      })
    },
    setProxy: (value: string, instanceName: string = 'default') => {
      config[instanceName].proxy = value
    },
    setHeadless: (value: boolean = false, instanceName: string = 'default') => {
      config[instanceName].headless = value
    },
    setUserDataDir: (value: string, instanceName: string = 'default') => {
      config[instanceName].userDataDir = value
    },
    setWindowSizeArg: (
      value: { width: number; height: number },
      instanceName: string = 'default',
    ) => {
      config[instanceName].windowSize = value
    },
    set2captchaToken: (value: string, instanceName: string = 'default') => {
      config[instanceName].twoCaptchaToken = value
    },

    setExtensionsPaths: (
      value: Array<string>,
      instanceName: string = 'default',
    ) => {
      config[instanceName].extensions = value
    },
    setDefaultNavigationTimeout: (
      value: boolean,
      instanceName: string = 'default',
    ) => {
      config[instanceName].defaultNavigationTimeout = value
    },
    blockImages: (value: boolean = true, instanceName: string = 'default') => {
      config[instanceName].blockImages = value
    },
    blockFonts: (value: boolean = true, instanceName: string = 'default') => {
      config[instanceName].blockFonts = value
    },
    blockCSS: (value: boolean = true, instanceName: string = 'default') => {
      config[instanceName].blockCSS = value
    },
    useChrome: (value: boolean = true, instanceName: string = 'default') => {
      config[instanceName].useChrome = value
    },
  }
})()
