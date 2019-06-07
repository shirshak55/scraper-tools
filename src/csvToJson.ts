import csv from 'csvtojson'
import AsyncLock from 'async-lock'

let lock = new AsyncLock()

export default async (path) => {
  return await lock.acquire(path, async function() {
    return await csv().fromFile(path)
  })
}
