import cheerio from 'cheerio'
import consoleMessage from './consoleMessage'

export default (dom) => {
    try {
        return cheerio.load(dom)
    } catch (e) {
        consoleMessage.error('Load Dom', 'Error from loadDom', e)
    }
}
