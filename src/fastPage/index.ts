import puppeteer from "puppeteer-core"
import chromePaths from "chrome-paths"
import { Page, Browser } from "puppeteer"
import AsyncLock from "async-lock"
import { _ } from "lodash"
import consoleMessage from "../consoleMessage"
import pageStealth from "./pageStealth"
import functionsToInject from "../functionToInject"

let lock = new AsyncLock()

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
  hooks: []
}

let config = {
  default: { ...defaultConfig }
}

async function loadHooks(hooks, name, ...args) {
  hooks
    .filter((v) => v.name === name)
    .forEach(async (v) => await v.action(...args))
}

async function browser(instanceName): Promise<Browser> {
  return await lock
    .acquire("instance_" + instanceName, async function() {
      if (config[instanceName].browserHandle)
        return config[instanceName].browserHandle

      let args = [
        `--window-size=${config[instanceName].windowSize.width},${config[instanceName].windowSize.height}`,
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-web-security",
        "--disable-features=site-per-process",
        "--ignore-certificate-errors",
        "--enable-features=NetworkService",
        "--allow-running-insecure-content",
        "--enable-automation",
        "--disable-background-timer-throttling",
        "--disable-backgrounding-occluded-windows",
        "--disable-renderer-backgrounding"
      ]

      if (config[instanceName].proxy) {
        args.push(`--proxy-server=${config[instanceName].proxy}`)
      }

      if (config[instanceName].extensions.length > 0) {
        args.push(
          `--disable-extensions-except=${config[instanceName].extensions.join(
            ","
          )}`,
          `--load-extension=${config[instanceName].extensions.join(",")}`
        )
      }

      let launchOptions: any = {
        userDataDir: config[instanceName].userDataDir,
        headless: config[instanceName].headless,
        args,
        ignoreDefaultArgs: ["--enable-automation"],
        defaultViewport: null,
        ignoreHTTPSErrors: true
      }

      launchOptions.executablePath = chromePaths.chrome

      config[instanceName].browserHandle = await puppeteer.launch(launchOptions)
      return config[instanceName].browserHandle
    })
    .catch((err) =>
      console.log("Error on starting new page: Lock Error ->", err)
    )
}

async function makePageFaster(page, instanceName): Promise<Page> {
  let instanceConfig = config[instanceName]
  await loadHooks(instanceConfig["hooks"], "make_page_faster", page)
  await page.setDefaultNavigationTimeout(
    instanceConfig.defaultNavigationTimeout
  )
  await page.setDefaultTimeout(instanceConfig.defaultNavigationTimeout)

  const session = await page.target().createCDPSession()
  await page.setBypassCSP(true)

  await pageStealth(page)

  await page.addScriptTag({
    content: `${functionsToInject.waitForElement} ${functionsToInject.waitForElementToBeRemoved} ${functionsToInject.delay}`
  })

  if (instanceConfig.showPageError === true) {
    page.on("error", (err) => {
      consoleMessage.error("Error happen at the page: ", err)
    })
    page.on("pageerror", (pageerr) => {
      consoleMessage.error("Page Error occurred: ", pageerr)
    })
  }
  if (
    instanceConfig.blockCSS ||
    instanceConfig.blockFonts ||
    instanceConfig.blockImages
  ) {
    await page.setRequestInterception(true)
    page.on("request", (request) => {
      if (
        (instanceConfig.blockImages && request.resourceType() === "image") ||
        (instanceConfig.blockFonts && request.resourceType() === "font") ||
        (instanceConfig.blockCSS && request.resourceType() === "stylesheet")
      ) {
        request.abort()
      } else {
        request.continue()
      }
    })
  }

  await session.send("Page.enable")
  await session.send("Page.setWebLifecycleState", {
    state: "active"
  })

  return page
}

export default (instanceName = "default") => {
  return {
    init: async (useCurrentDefaultConfig = true) => {
      if (useCurrentDefaultConfig) {
        config[instanceName] = { ...config.default }
      } else {
        config[instanceName] = { ...defaultConfig }
      }
    },
    getBrowserHandle: async (): Promise<Browser> => {
      return await browser(instanceName)
    },

    newPage: async (): Promise<Page> => {
      consoleMessage.info("Fast Page", "Launching new page ")
      let brow = await browser(instanceName)
      let page = await brow.newPage()
      await makePageFaster(page, instanceName)
      return page
    },
    closeBrowser: async () => {
      consoleMessage.info("Fast Page", "Requesting to close browser ")
      return await lock
        .acquire("instance_close_" + instanceName, async function() {
          if (config[instanceName].browserHandle) {
            let bHandle = await browser(instanceName)
            await bHandle.close()
          }
          config[instanceName].browserHandle = null
          return "closed"
        })
        .catch((err) =>
          console.log("Error on closing browser: Lock Error ->", err)
        )
    },
    setProxy: (value: string) => {
      consoleMessage.info("Fast Page", "Setting proxy to ", value)
      config[instanceName].proxy = value
    },
    setShowPageError: (value: boolean) => {
      consoleMessage.info("Fast Page", "Setting show page error to ", value)
      config[instanceName].showPageError = value
    },
    setHeadless: (value: boolean = false) => {
      consoleMessage.info("Fast Page", "Setting headless to ", value)
      config[instanceName].headless = value
    },
    setUserDataDir: (value: string) => {
      consoleMessage.info("Fast Page", "Storing chrome cache in  ", value)
      config[instanceName].userDataDir = value
    },
    setWindowSizeArg: (value: { width: number; height: number }) => {
      consoleMessage.info("Fast Page", "Setting window size to ", value)
      config[instanceName].windowSize = value
    },
    set2captchaToken: (value: string) => {
      consoleMessage.info("Fast Page", "Setting 2captcha token to ", value)
      config[instanceName].twoCaptchaToken = value
    },

    setExtensionsPaths: (value: Array<string>) => {
      config[instanceName].extensions = value
    },
    setDefaultNavigationTimeout: (value: number) => {
      consoleMessage.info("Fast Page", "Default navigation timeout", value)
      config[instanceName].defaultNavigationTimeout = value
    },
    blockImages: (value: boolean = true) => {
      consoleMessage.info("Fast Page", "Block Image", value)
      config[instanceName].blockImages = value
    },
    blockFonts: (value: boolean = true) => {
      consoleMessage.info("Fast Page", "Block Font", value)
      config[instanceName].blockFonts = value
    },
    blockCSS: (value: boolean = true) => {
      consoleMessage.info("Fast Page", "Block CSS", value)
      config[instanceName].blockCSS = value
    },
    getConfig(instanceName = null) {
      if (instanceName === null) {
        return config
      }
      return config[instanceName]
    },
    addHook(name, action) {
      config[instanceName].hooks.push({ name, action })
    }
  }
}
