import AsyncLock from "async-lock"
import debug from "debug"
import playwright, {
  Browser,
  BrowserContext,
  BrowserContextOptions,
  CDPSession,
  ChromiumBrowserContext,
  LaunchOptions,
  Page,
} from "playwright"
import functionsToInject from "../functionToInject"
import pageStealth from "./pageStealth"
import { PathLike } from "fs-extra"

let error = debug("scrapper_tools:fastpage:error")
let info = debug("scrapper_tools:fastpage:info")
let lock = new AsyncLock()

interface BrowserTypeLaunchOptionsProxy {
  server: string
  bypass?: string
  username?: string
  password?: string
}

interface ConfigValue {
  browserHandle?: BrowserContext
  nonPersistantBrowserHandle?: any
  browser: "chromium" | "firefox" | "webkit"
  proxy?: BrowserTypeLaunchOptionsProxy
  headless: boolean
  devtools: boolean
  userDataDir?: string
  windowSize: { width: number; height: number }
  blockFonts: boolean
  blockImages: boolean
  blockCSS: boolean
  defaultNavigationTimeout: number
  extensions: Array<String>
  showPageError: boolean
  userAgent: string
  args: Array<string>
  hooks: any
  enableStealth: boolean
  downloadDir: any | PathLike
}

let defaultConfig: ConfigValue = {
  browserHandle: undefined,
  browser: "chromium",
  nonPersistantBrowserHandle: undefined,
  proxy: undefined,
  headless: false,
  devtools: false,
  userDataDir: undefined,
  windowSize: { width: 595, height: 842 },
  blockFonts: false,
  blockImages: false,
  blockCSS: false,
  enableStealth: true,
  defaultNavigationTimeout: 30 * 1000,
  extensions: [],
  showPageError: false,
  userAgent:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36",
  args: [],
  hooks: [],
  downloadDir: null,
}

interface Config {
  [name: string]: ConfigValue
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
      if (config[instanceName].browserHandle) {
        return config[instanceName].browserHandle
      }

      let args: Array<string> = [
        "--no-sandbox",
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

      if(config[instanceName].browser === "chromium"){
        args.push(`--window-size=${config[instanceName].windowSize.width},${config[instanceName].windowSize.height}`)
      }

      if (config[instanceName].userDataDir) {
        args.push(`---user-data-dir=${config[instanceName].userDataDir}`)
      }

      if (config[instanceName].extensions.length > 0) {
        args.push(
          `--disable-extensions-except=${config[instanceName].extensions.join(",")}`,
          `--load-extension=${config[instanceName].extensions.join(",")}`
        )
      }

      let launchOption: any = {
        headless: config[instanceName].headless,
        args,
        devtools: config[instanceName].devtools,
        acceptDownloads: true,
      }

      if (config[instanceName].downloadDir) {
        launchOption.downloadsPath = config[instanceName].downloadDir
      }

      if (config[instanceName].proxy) {
        launchOption.proxy = config[instanceName].proxy
      }

      if (config[instanceName].userDataDir) {
        config[instanceName].browserHandle = await playwright[
          config[instanceName].browser
        ].launchPersistentContext(config[instanceName].userDataDir!, {
          acceptDownloads: true,
          colorScheme: "dark",
          ...launchOption,
        })
      } else {
        let browser = await playwright[config[instanceName].browser].launch(launchOption)

        let contextOption: BrowserContextOptions = {
          ignoreHTTPSErrors: true,
          acceptDownloads: true,
          bypassCSP: true,
          userAgent:
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36",
          colorScheme: "dark",
        }

        config[instanceName].nonPersistantBrowserHandle = browser
        config[instanceName].browserHandle = await browser.newContext(contextOption)
      }

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
): Promise<{ session: CDPSession | null; page: Page }> {
  let instanceConfig: typeof defaultConfig = config[instanceName]
  await loadHooks(instanceConfig["hooks"], "make_page_faster", page)
  page.setDefaultNavigationTimeout(instanceConfig.defaultNavigationTimeout)
  page.setDefaultTimeout(instanceConfig.defaultNavigationTimeout)

  let session: null | CDPSession = null

  if (instanceConfig.browser === "chromium") {
    session = await (page.context() as ChromiumBrowserContext).newCDPSession(page)
  }

  if (instanceConfig.enableStealth === true) {
    await pageStealth(page)
  }

  await page.addScriptTag({
    content: `${functionsToInject.waitForElement} ${functionsToInject.waitForElementToBeRemoved} ${functionsToInject.delay}`,
  })

  if (instanceConfig.showPageError === true) {
    page.on("pageerror", (err: any) => {
      error("Error happen at the page: ", err)
    })
    page.on("pageerror", (pageerr: any) => {
      error("Page Error occurred: ", pageerr)
    })
  }
  if (instanceConfig.blockCSS || instanceConfig.blockFonts || instanceConfig.blockImages) {
    // await page.setRequestInterception(true)
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

  if (session) {
    await session.send("Page.setWebLifecycleState", {
      state: "active",
    })
  }

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

    newPage1: async (): Promise<{ session: CDPSession | null; page: Page }> => {
      info("Fast Page", "Launching new page with session ")
      let brow = await browser(instanceName)
      let { page, session } = await makePageFaster(await brow.newPage(), instanceName)
      return { page, session }
    },

    closeBrowser: async () => {
      info("Fast Page", "Requesting to close browser ")
      return await lock
        .acquire("instance_close_" + instanceName, async function () {
          if (config[instanceName].nonPersistantBrowserHandle) {
            config[instanceName].nonPersistantBrowserHandle.close()
          } else if (config[instanceName].browserHandle) {
            let bHandle = await browser(instanceName)
            await bHandle.close()
          }
          config[instanceName].browserHandle = undefined
          config[instanceName].nonPersistantBrowserHandle = undefined
          return "closed"
        })
        .catch((err: any) => console.log("Error on closing browser: Lock Error ->", err))
    },

    setProxy: (value: BrowserTypeLaunchOptionsProxy) => {
      info("Fast Page", "Setting proxy to ", value)
      config[instanceName].proxy = value
    },

    setDefaultBrowser: (name: "chromium" | "firefox" | "webkit") => {
      config[instanceName].browser = name
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

    setExtensionsPaths: (value: Array<string>) => {
      config[instanceName].extensions = value
    },

    setStealth: (value: boolean) => {
      config[instanceName].enableStealth = value
    },

    setDefaultNavigationTimeout: (value: number) => {
      info("Fast Page", "Default navigation timeout", value)
      config[instanceName].defaultNavigationTimeout = value
    },

    setDownloadDir: (value: PathLike) => {
      info("Fast Page", "Download timeout", value)
      config[instanceName].downloadDir = value
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
