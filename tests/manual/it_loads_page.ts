import fastPage from "../../src/fastPage"

async function main() {
  fastPage().addHook("make_page_faster", async (page, info) => {
    console.log("this hook is loaded before page is fast")
  })
  let page = await fastPage().newPage()

  await page.goto("https://www.distilnetworks.com/", {
    waitUntil: "networkidle0",
  })
}

main().catch(console.log)
