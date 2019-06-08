// import puppeteer from 'puppeteer-core'
import chromePaths from 'chrome-paths'
import puppeteer from 'puppeteer-extra'
import pluginStealth from 'puppeteer-extra-plugin-stealth'
import pluginUAFix from 'puppeteer-extra-plugin-anonymize-ua'
import { Page, Browser } from 'puppeteer'
import RecaptchaPlugin from 'puppeteer-extra-plugin-recaptcha'
import AsyncLock from 'async-lock'
import { _ } from '..'

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

  async function browser(instanceName = 'default'): Promise<Browser> {
    return await lock
      .acquire('instance_' + instanceName, async function() {
        if (config[instanceName].browserHandle)
          return config[instanceName].browserHandle

        const args = [
          '--disable-infobars',
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--ignore-certificate-errors',
          '--enable-features=NetworkService',
          `--window-size=${config[instanceName].windowSize.width},${
            config[instanceName].windowSize.height
          }`,
          '--disable-background-timer-throttling',
          '--disable-backgrounding-occluded-windows',
          '--disable-renderer-backgrounding',
        ]

        if (config[instanceName].proxy) {
          args.push(`--proxy-server=${config[instanceName].proxy}`)
        }

        if (config[instanceName].extensions.length > 0) {
          args.push(
            `--disable-extensions-except=${config[instanceName].extensions.join(
              ',',
            )}`,
            `--load-extension=${config[instanceName].extensions.join(',')}`,
          )
        }

        let launchOptions: any = {
          userDataDir: config[instanceName].userDataDir,
          headless: config[instanceName].headless,
          args,
          ignoreHTTPSErrors: true,
        }

        if (config[instanceName].useChrome === true) {
          launchOptions.executablePath = chromePaths.chrome
        }

        config[instanceName].browserHandle = await puppeteer.launch(
          launchOptions,
        )
        return config[instanceName].browserHandle
      })
      .catch((err) =>
        console.log('Error on starting new page: Lock Error ->', err),
      )
  }

  async function makePageFaster(page, instanceName = 'default'): Promise<Page> {
    return await lock.acquire('instance_' + instanceName, async function() {
      if (
        config[instanceName].blockCSS ||
        config[instanceName].blockFonts ||
        config[instanceName].blockImages
      ) {
        await page.setRequestInterception(true)
        page.on('request', (request) => {
          if (
            (config[instanceName].blockImages &&
              request.resourceType() === 'image') ||
            (config[instanceName].blockFonts &&
              request.resourceType() === 'font') ||
            (config[instanceName].blockCSS &&
              request.resourceType() === 'stylesheet')
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
      await session.send('Page.setWebLifecycleState', {
        state: 'active',
      })
      await page.setDefaultNavigationTimeout(
        config[instanceName].defaultNavigationTimeout,
      )
      return page
    })
  }

  return {
    init: async (instanceName: string, useCurrentDefaultConfig = true) => {
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
      return await lock
        .acquire('instance_close_' + instanceName, async function() {
          if (config[instanceName].browserHandle) {
            let bHandle = await browser(instanceName)
            await bHandle.close()
          }
          config[instanceName].browserHandle = null
          return 'closed'
        })
        .catch((err) =>
          console.log('Error on closing browser: Lock Error ->', err),
        )
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
      value: number,
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
    getConfig(instanceName = null) {
      if (instanceName === null) {
        return config
      }

      return config[instanceName]
    },
  }
})()
