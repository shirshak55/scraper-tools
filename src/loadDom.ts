import cheerio from "cheerio"
import { consoleMessage } from "./consoleMessage"

export function loadDom(dom: any) {
  try {
    return cheerio.load(dom)
  } catch (e) {
    consoleMessage.error("Load Dom", "Error from loadDom", e)
    throw e
  }
}
