import { fastPage } from "../.."

async function main() {
  fastPage().setDefaultBrowser("edge")
  fastPage().addHook("make_page_faster", async (page: any, info: any) => {
    console.log("this hook is loaded before page is fast")
  })
  let page = await fastPage().newPage()

  await page.goto("https://www.distilnetworks.com/", {
    waitUntil: "networkidle0"
  })
}

main().catch(console.log)
