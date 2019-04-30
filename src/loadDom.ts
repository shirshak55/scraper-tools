import cheerio from 'cheerio'
import { error, info, warning, success } from './consoleMessage'

export default (dom) => {
    try {
        return cheerio.load(dom)
    } catch (e) {
        error('Error from loadDom', e)
    }
}
