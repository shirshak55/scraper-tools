import csv from "csvtojson"
import AsyncLock from "async-lock"
import { PathLike } from "fs-extra"

let lock = new AsyncLock()

export async function csvToJson(path: PathLike) {
  return await lock.acquire(path as string, async function() {
    return await csv().fromFile(path as string)
  })
}
