import puppeteer, { CDPSession } from "puppeteer-core"
import chromePaths from "chrome-paths"
import { Page, Browser } from "puppeteer-core"
import AsyncLock from "async-lock"
import _ from "lodash"
import pageStealth from "./pageStealth"
import functionsToInject from "../functionToInject"
import debug from "debug"

let error = debug("scrapper_tools:fastpage:error")
let info = debug("scrapper_tools:fastpage:info")
let lock = new AsyncLock()

let defaultConfig = {
  browserHandle: null,
  defaultBrowser: "chrome",
  proxy: null,
  headless: false,
  devtools: false,
  userDataDir: null,
  windowSize: { width: 595, height: 842 },
  blockFonts: false,
  blockImages: false,
  blockCSS: false,
  defaultNavigationTimeout: 30 * 1000,
  extensions: [],
  showPageError: false,
  userAgent:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36",
  args: [],
  hooks: [],
}

interface Config {
  [name: string]: any
}

let config: Config = {
  default: { ...defaultConfig },
}

async function loadHooks(hooks: any, name: string, ...args: any): Promise<void> {
  hooks.filter((v: any) => v.name === name).forEach(async (v: any) => await v.action(...args))
}

async function browser(instanceName: string): Promise<Browser> {
  return await lock
    .acquire("instance_" + instanceName, async function () {
      if (config[instanceName].browserHandle) return config[instanceName].browserHandle

      let args = [
        "--no-sandbox",
        `--window-size=${config[instanceName].windowSize.width},${config[instanceName].windowSize.height}`,
        "--disable-features=site-per-process",
        "--enable-features=NetworkService",
        "--allow-running-insecure-content",
        "--enable-automation",
        "--disable-background-timer-throttling",
        "--disable-backgrounding-occluded-windows",
        "--disable-renderer-backgrounding",
        "--disable-web-security",
        ...config[instanceName].args,
      ]

      if (config[instanceName].userDataDir) {
        args.push(`---user-data-dir=${config[instanceName].userDataDir}`)
      }

      if (config[instanceName].proxy) {
        args.push(`--proxy-server=${config[instanceName].proxy}`)
      }

      if (config[instanceName].extensions.length > 0) {
        args.push(
          `--disable-extensions-except=${config[instanceName].extensions.join(",")}`,
          `--load-extension=${config[instanceName].extensions.join(",")}`
        )
      }

      let launchOptions: any = {
        userDataDir: config[instanceName].userDataDir,
        headless: config[instanceName].headless,
        args,
        ignoreDefaultArgs: ["--enable-automation"],
        defaultViewport: null,
        ignoreHTTPSErrors: true,
      }

      if (config[instanceName].defaultBrowser === "chrome") {
        launchOptions.executablePath = chromePaths.chrome
      }
      if (config[instanceName].defaultBrowser === "edge") {
        throw "Edge not supported yet"
      }

      launchOptions.devtools = config[instanceName].devtools

      config[instanceName].browserHandle = await puppeteer.launch(launchOptions)
      return config[instanceName].browserHandle
    })
    .catch((err: any) => {
      error("Error on starting new page: Lock Error ->", err)
      throw err
    })
}

export async function makePageFaster(
  page: Page,
  instanceName: string
): Promise<{ session: CDPSession; page: Page }> {
  let instanceConfig: typeof defaultConfig = config[instanceName]
  await loadHooks(instanceConfig["hooks"], "make_page_faster", page)
  await page.setDefaultNavigationTimeout(instanceConfig.defaultNavigationTimeout)
  await page.setDefaultTimeout(instanceConfig.defaultNavigationTimeout)

  const session = await page.target().createCDPSession()
  await page.setBypassCSP(true)

  await page.setUserAgent(instanceConfig.userAgent)
  await pageStealth(page)

  await page.addScriptTag({
    content: `${functionsToInject.waitForElement} ${functionsToInject.waitForElementToBeRemoved} ${functionsToInject.delay}`,
  })

  if (instanceConfig.showPageError === true) {
    page.on("error", (err: any) => {
      error("Error happen at the page: ", err)
    })
    page.on("pageerror", (pageerr: any) => {
      error("Page Error occurred: ", pageerr)
    })
  }
  if (instanceConfig.blockCSS || instanceConfig.blockFonts || instanceConfig.blockImages) {
    await page.setRequestInterception(true)
    page.on("request", (request: any) => {
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
    state: "active",
  })

  return { session, page }
}

export function fastPage(instanceName = "default") {
  async function init(useCurrentDefaultConfig = true) {
    if (useCurrentDefaultConfig) {
      config[instanceName] = { ...config.default }
    } else {
      config[instanceName] = { ...defaultConfig }
    }
  }

  return {
    init: init,

    getBrowserHandle: async (): Promise<Browser> => {
      return await browser(instanceName)
    },

    newPage: async (): Promise<Page> => {
      info("Fast Page", "Launching new page ")
      if (!config[instanceName]) {
        info("Fast Page", "Using default config")
        await init()
      }

      let brow = await browser(instanceName)
      let { page } = await makePageFaster(await brow.newPage(), instanceName)
      return page
    },

    newPage1: async (): Promise<{ session: CDPSession; page: Page }> => {
      info("Fast Page", "Launching new page with session ")
      let brow = await browser(instanceName)
      let { page, session } = await makePageFaster(await brow.newPage(), instanceName)
      return { page, session }
    },

    closeBrowser: async () => {
      info("Fast Page", "Requesting to close browser ")
      return await lock
        .acquire("instance_close_" + instanceName, async function () {
          if (config[instanceName].browserHandle) {
            let bHandle = await browser(instanceName)
            await bHandle.close()
          }
          config[instanceName].browserHandle = null
          return "closed"
        })
        .catch((err: any) => console.log("Error on closing browser: Lock Error ->", err))
    },

    setProxy: (value: string) => {
      info("Fast Page", "Setting proxy to ", value)
      config[instanceName].proxy = value
    },

    setDefaultBrowser: (name: "chrome" | "edge") => {
      if (name !== "chrome" && name !== "edge") {
        throw "Browser not support."
      }

      config[instanceName].defaultBrowser = name
    },

    setShowPageError: (value: boolean) => {
      info("Fast Page", "Setting show page error to ", value)
      config[instanceName].showPageError = value
    },

    setHeadless: (value: boolean = false) => {
      info("Fast Page", "Setting headless to ", value)
      config[instanceName].headless = value
    },

    setDevtools: (value: boolean = true) => {
      info("Fast Page", "Setting devtools to ", value)
      config[instanceName].devtools = value
    },

    setUserDataDir: (value: string) => {
      info("Fast Page", "Storing chrome cache in  ", value)
      config[instanceName].userDataDir = value
    },

    setUserAgent: (value: string) => {
      info("Fast Page", "Setting user agent in  ", value)
      config[instanceName].userAgent = value
    },

    setWindowSizeArg: (value: { width: number; height: number }) => {
      info("Fast Page", "Setting window size to ", value)
      config[instanceName].windowSize = value
    },

    set2captchaToken: (value: string) => {
      info("Fast Page", "Setting 2captcha token to ", value)
      config[instanceName].twoCaptchaToken = value
    },

    setExtensionsPaths: (value: Array<string>) => {
      config[instanceName].extensions = value
    },

    setDefaultNavigationTimeout: (value: number) => {
      info("Fast Page", "Default navigation timeout", value)
      config[instanceName].defaultNavigationTimeout = value
    },

    blockImages: (value: boolean = true) => {
      info("Fast Page", "Block Image", value)
      config[instanceName].blockImages = value
    },

    blockFonts: (value: boolean = true) => {
      info("Fast Page", "Block Font", value)
      config[instanceName].blockFonts = value
    },

    blockCSS: (value: boolean = true) => {
      info("Fast Page", "Block CSS", value)
      config[instanceName].blockCSS = value
    },

    getConfig(instanceName: string = "default") {
      if (instanceName === null) {
        return config
      }
      return config.instanceName
    },

    addHook(name: string, action: Function) {
      config[instanceName].hooks.push({ name, action })
    },

    addArg(arg: any) {
      config[instanceName].args.push(arg)
    },
  }
}
