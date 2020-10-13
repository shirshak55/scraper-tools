import { fastPage } from "../"

async function main() {
  let page = await fastPage().newPage()

  await page.goto("https://bot.sannysoft.com/")
}

main().catch((e) => {
  console.error(e)
})
