import fastPage from '../../src/fastPage'

async function main() {
  await fastPage.blockCSS()
  let page = await fastPage.newPage()

  await page.goto('https://facebook.com', { waitUntil: 'networkidle0' })
}

main().catch(console.log)
