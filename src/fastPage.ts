// import puppeteer from 'puppeteer-core'
import chromePaths from 'chrome-paths'
import path from 'path'
import puppeteer from 'puppeteer-extra'
import pluginStealth from 'puppeteer-extra-plugin-stealth'
import pluginUAFix from 'puppeteer-extra-plugin-anonymize-ua'
import { Page, Browser } from 'puppeteer'
import RecaptchaPlugin from 'puppeteer-extra-plugin-recaptcha'

function fastPage() {
    let proxy = null
    let b = null
    let twoCaptchaToken = ''

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
        if (b) return b

        const args = ['--no-sandbox', `--disable-extensions-except=${uBlockExt}`, `--load-extension=${uBlockExt}`]

        if (proxy) {
            args.push(`--proxy-server=${proxy}`)
        }

        b = await puppeteer.launch({
            userDataDir: path.join(__dirname + '../../../.user-dir'),
            executablePath: chromePaths.chrome,
            headless: false,
            args,
        })
        return b
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
            if (b) {
                let brow = await browser()
                await brow.close()
            }
            b = null
        },
        setProxy: (value) => {
            proxy = value
        },
        set2captchaToken: (value) => {
            twoCaptchaToken = value
        },
    }
}

export default fastPage()
