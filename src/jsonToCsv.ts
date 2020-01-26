import AsyncLock from "async-lock";
let lock = new AsyncLock();
import { Parser } from "json2csv";

export default async (fields: Array<any>, jsObjects: any) => {
  return await lock.acquire("jsonToCSV", async () => {
    const parser = new Parser({
      fields
    });
    return parser.parse(jsObjects);
  });
};
