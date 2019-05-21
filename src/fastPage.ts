// import puppeteer from 'puppeteer-core'
import chromePaths from 'chrome-paths'
import puppeteer from 'puppeteer-extra'
import pluginStealth from 'puppeteer-extra-plugin-stealth'
import pluginUAFix from 'puppeteer-extra-plugin-anonymize-ua'
import { Page, Browser } from 'puppeteer'
import RecaptchaPlugin from 'puppeteer-extra-plugin-recaptcha'

export default (() => {
    let browserHandle = null
    let proxy = null
    let twoCaptchaToken = ''
    let headless = false
    let userDataDir = null
    let windowSize = { width: 595, height: 842 }
    let blockFonts = false
    let blockImages = false
    let blockCSS = false

    const recaptchaPlugin = RecaptchaPlugin({
        provider: { id: '2captcha', token: twoCaptchaToken },
    })

    puppeteer.use(pluginStealth())
    puppeteer.use(recaptchaPlugin)
    puppeteer.use(
        pluginUAFix({
            stripHeadless: true,
            makeWindows: true,
        }),
    )

    async function browser(): Promise<Browser> {
        if (browserHandle) return browserHandle

        const args = [
            '--disable-infobars',
            '--no-sandbox',
            '--disable-setuid-sandbox',
            `--window-size=${windowSize.width},${windowSize.height}`,
        ]

        if (proxy) {
            args.push(`--proxy-server=${proxy}`)
        }

        browserHandle = await puppeteer.launch({
            userDataDir,
            executablePath: chromePaths.chrome,
            headless,
            args,
        })
        return browserHandle
    }

    async function makePageFaster(page): Promise<Page> {
        await page.setRequestInterception(true)
        await page.target().createCDPSession()
        await page.setBypassCSP(true)
        await page.setDefaultNavigationTimeout(120 * 1000)
        await page.evaluateOnNewDocument(() => {
            Object.defineProperty(document, 'hidden', { value: false })
        })
        page.on('request', (request) => {
            if (
                (blockImages && request.resourceType() === 'image') ||
                (blockFonts && request.resourceType() === 'font') ||
                (blockCSS && request.resourceType() === 'stylesheet')
            ) {
                request.abort()
            } else {
                request.continue()
            }
        })
        return page
    }

    return {
        newPage: async (): Promise<Page> => {
            let brow = await browser()
            let page = await brow.newPage()
            await makePageFaster(page)
            return page
        },
        closeBrowser: async () => {
            if (browserHandle) {
                let bHandle = await browser()
                await bHandle.close()
            }
            browserHandle = null
        },
        setProxy: (value: string) => {
            proxy = value
        },
        setHeadless: (value: boolean = false) => {
            headless = value
        },
        setUserDataDir: (value: string) => {
            userDataDir = value
        },
        setWindowSizeArg: (value: { width: number; height: number }) => {
            windowSize = value
        },
        set2captchaToken: (value: string) => {
            twoCaptchaToken = value
        },
        blockImages: (value: boolean = false) => {
            blockImages = value
        },
        blockFonts: (value: boolean = false) => {
            blockFonts = value
        },
        blockCSS: (value: boolean = false) => {
            blockCSS = value
        },
    }
})()
