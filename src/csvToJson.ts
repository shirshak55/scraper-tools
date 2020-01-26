import csv from "csvtojson";
import AsyncLock from "async-lock";
import { PathLike } from "fs-extra";

let lock = new AsyncLock();

export default async (path: PathLike) => {
  return await lock.acquire(path as string, async function() {
    return await csv().fromFile(path as string);
  });
};
