// import puppeteer from 'puppeteer-core'
import chromePaths from 'chrome-paths'
import path from 'path'
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
        const uBlockExt = path.join(__dirname, './extensions/uBlock')
        if (browserHandle) return browserHandle

        const args = ['--no-sandbox', `--disable-extensions-except=${uBlockExt}`, `--load-extension=${uBlockExt}`]

        if (proxy) {
            args.push(`--proxy-server=${proxy}`)
        }

        browserHandle = await puppeteer.launch({
            userDataDir: path.join(__dirname + '../../../.user-dir'),
            executablePath: chromePaths.chrome,
            headless,
            args,
        })
        return browserHandle
    }

    async function makePageFaster(page): Promise<Page> {
        await page.setDefaultNavigationTimeout(120 * 1000)
        await page.evaluateOnNewDocument(() => {
            Object.defineProperty(document, 'hidden', { value: false })
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
        setHeadless: (value: boolean) => {
            headless: value
        },
        set2captchaToken: (value: string) => {
            twoCaptchaToken = value
        },
    }
})()
