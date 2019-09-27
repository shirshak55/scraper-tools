import fastPage from '../../src/fastPage'

async function main() {
  let page = await fastPage.newPage()

  await page.goto('https://bot.sannysoft.com/', {
    waitUntil: 'networkidle0',
  })
}

main().catch(console.log)
