import chalk from 'chalk'
import pRetry from 'p-retry'
const fs = require('fs')
const got = require('got')
const exists = require('./exists')

export default async function download(filePath, url) {
  if (await exists(filePath)) {
    return
  }

  console.log(chalk.dim(`    Downloading: ${chalk.italic(url)}`))

  await pRetry(
    () => {
      new Promise((resolve, reject) => {
        got
          .stream(url, { retry: 4, throwHttpErrors: false })
          .on('error', (err) => {
            console.error(err)
            resolve()
          })
          .pipe(fs.createWriteStream(filePath))
          .on('finish', resolve)
          .on('error', (err) => {
            console.error(err)
            fs.unlink(filePath, () => resolve)
          })
      })
    },
    { retries: 3 },
  )
}
