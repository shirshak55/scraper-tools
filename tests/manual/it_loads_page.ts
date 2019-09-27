import fastPage from '../../src/fastPage'

async function main() {
  let page = await fastPage.newPage()

  await page.goto('https://subscription.packtpub.com/book/application_development/9781788399975', {
    waitUntil: 'networkidle0',
  })
}

main().catch(console.log)
