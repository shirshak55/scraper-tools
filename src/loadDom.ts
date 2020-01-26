import cheerio from "cheerio";
import consoleMessage from "./consoleMessage";

export default function(dom: any) {
  try {
    return cheerio.load(dom);
  } catch (e) {
    consoleMessage.error("Load Dom", "Error from loadDom", e);
    throw e;
  }
}
