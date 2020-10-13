import { fastPage } from "../"

async function main() {
  await fastPage().setUserDataDir("_gitignore")
  let page = await fastPage().newPage()

  await page.goto("https://bot.sannysoft.com/")

  let page1 = await fastPage().newPage()

  await page1.goto("https://bot.sannysoft.com/")
}

main().catch((e) => {
  console.error(e)
})
