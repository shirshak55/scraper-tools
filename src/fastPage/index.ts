import puppeteer from 'puppeteer-core'
import chromePaths from 'chrome-paths'
import { Page, Browser } from 'puppeteer'
import AsyncLock from 'async-lock'
import { _ } from 'lodash'
import consoleMessage from '../consoleMessage'
import pageStealth from './pageStealth'

let lock = new AsyncLock()

export default (() => {
  let twoCaptchaToken: ''
  let defaultConfig = {
    browserHandle: null,
    proxy: null,
    headless: false,
    userDataDir: null,
    windowSize: { width: 595, height: 842 },
    blockFonts: false,
    blockImages: false,
    blockCSS: false,
    defaultNavigationTimeout: 30 * 1000,
    extensions: [],
    showPageError: false,
  }
  let config = {
    default: { ...defaultConfig },
  }

  async function browser(instanceName = 'default'): Promise<Browser> {
    return await lock
      .acquire('instance_' + instanceName, async function() {
        if (config[instanceName].browserHandle) return config[instanceName].browserHandle

        const args = [
          `--window-size=${config[instanceName].windowSize.width},${config[instanceName].windowSize.height}`,
        ]

        if (config[instanceName].proxy) {
          args.push(`--proxy-server=${config[instanceName].proxy}`)
        }

        if (config[instanceName].extensions.length > 0) {
          args.push(
            `--disable-extensions-except=${config[instanceName].extensions.join(',')}`,
            `--load-extension=${config[instanceName].extensions.join(',')}`,
          )
        }

        let launchOptions: any = {
          userDataDir: config[instanceName].userDataDir,
          headless: config[instanceName].headless,
          args,
          ignoreHTTPSErrors: true,
        }

        launchOptions.executablePath = chromePaths.chrome

        config[instanceName].browserHandle = await puppeteer.launch(launchOptions)
        return config[instanceName].browserHandle
      })
      .catch((err) => console.log('Error on starting new page: Lock Error ->', err))
  }

  async function makePageFaster(page, instanceName = 'default'): Promise<Page> {
    await page.setDefaultNavigationTimeout(config[instanceName].defaultNavigationTimeout)
    await page.setDefaultTimeout(config[instanceName].defaultNavigationTimeout)

    const session = await page.target().createCDPSession()
    await page.setBypassCSP(true)

    await pageStealth(page)

    if (config[instanceName].showPageError === true) {
      page.on('error', (err) => {
        consoleMessage.error('Error happen at the page: ', err)
      })
      page.on('pageerror', (pageerr) => {
        consoleMessage.error('Page Error occurred: ', pageerr)
      })
    }
    if (config[instanceName].blockCSS || config[instanceName].blockFonts || config[instanceName].blockImages) {
      await page.setRequestInterception(true)
      page.on('request', (request) => {
        if (
          (config[instanceName].blockImages && request.resourceType() === 'image') ||
          (config[instanceName].blockFonts && request.resourceType() === 'font') ||
          (config[instanceName].blockCSS && request.resourceType() === 'stylesheet')
        ) {
          request.abort()
        } else {
          request.continue()
        }
      })
    }

    await session.send('Page.enable')
    await session.send('Page.setWebLifecycleState', {
      state: 'active',
    })

    return page
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
      consoleMessage.info('Fast Page', 'Launching new page ')
      let brow = await browser(instanceName)
      let page = await brow.newPage()
      await makePageFaster(page, instanceName)
      return page
    },
    closeBrowser: async (instanceName: string = 'default') => {
      consoleMessage.info('Fast Page', 'Requesting to close browser ')
      return await lock
        .acquire('instance_close_' + instanceName, async function() {
          if (config[instanceName].browserHandle) {
            let bHandle = await browser(instanceName)
            await bHandle.close()
          }
          config[instanceName].browserHandle = null
          return 'closed'
        })
        .catch((err) => console.log('Error on closing browser: Lock Error ->', err))
    },
    setProxy: (value: string, instanceName: string = 'default') => {
      consoleMessage.info('Fast Page', 'Setting proxy to ', value)
      config[instanceName].proxy = value
    },
    setHeadless: (value: boolean = false, instanceName: string = 'default') => {
      consoleMessage.info('Fast Page', 'Setting headless to ', value)
      config[instanceName].headless = value
    },
    setUserDataDir: (value: string, instanceName: string = 'default') => {
      consoleMessage.info('Fast Page', 'Storing chrome cache in  ', value)
      config[instanceName].userDataDir = value
    },
    setWindowSizeArg: (value: { width: number; height: number }, instanceName: string = 'default') => {
      consoleMessage.info('Fast Page', 'Setting window size to ', value)
      config[instanceName].windowSize = value
    },
    set2captchaToken: (value: string, instanceName: string = 'default') => {
      consoleMessage.info('Fast Page', 'Setting 2captcha token to ', value)
      config[instanceName].twoCaptchaToken = value
    },

    setExtensionsPaths: (value: Array<string>, instanceName: string = 'default') => {
      config[instanceName].extensions = value
    },
    setDefaultNavigationTimeout: (value: number, instanceName: string = 'default') => {
      consoleMessage.info('Fast Page', 'Default navigation timeout', value)
      config[instanceName].defaultNavigationTimeout = value
    },
    blockImages: (value: boolean = true, instanceName: string = 'default') => {
      consoleMessage.info('Fast Page', 'Block Image', value)
      config[instanceName].blockImages = value
    },
    blockFonts: (value: boolean = true, instanceName: string = 'default') => {
      consoleMessage.info('Fast Page', 'Block Font', value)
      config[instanceName].blockFonts = value
    },
    blockCSS: (value: boolean = true, instanceName: string = 'default') => {
      consoleMessage.info('Fast Page', 'Block CSS', value)
      config[instanceName].blockCSS = value
    },
    getConfig(instanceName = null) {
      if (instanceName === null) {
        return config
      }
      return config[instanceName]
    },
  }
})()
