// import puppeteer from 'puppeteer-core'
import chromePaths from 'chrome-paths'
import path from 'path'
import puppeteer from 'puppeteer-extra'
import pluginStealth from 'puppeteer-extra-plugin-stealth'
import { Page, Browser } from 'puppeteer'
import RecaptchaPlugin from 'puppeteer-extra-plugin-recaptcha'
import chalk from 'chalk'

const recaptchaPlugin = RecaptchaPlugin({
    provider: { id: '2captcha', token: '2a82c98a5b6fb14b53bfbcc03fd02d20' },
})

puppeteer.use(pluginStealth())
puppeteer.use(recaptchaPlugin)
let b = null

let proxy = { value: null }

let browser = async (): Promise<Browser> => {
    const uBlockExt = path.join(__dirname, './extensions/uBlock')
    if (b) return b

    const args = ['--no-sandbox', `--disable-extensions-except=${uBlockExt}`, `--load-extension=${uBlockExt}`]

    if (proxy.value) {
        args.push(`--proxy-server=${proxy.value}`)
    }

    console.log(chalk.magenta(`[Browser]`), 'Starting to launch bot with proxy', proxy.value)
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

export default {
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
        let p = { ...proxy }
        proxy = p
    },
}
