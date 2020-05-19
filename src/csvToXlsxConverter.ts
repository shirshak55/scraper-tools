import fs from "fs-extra"
import csv from "csv-parse/lib/sync"
import xlsx from "xlsx"

export function convertCsvToXlsx(source: string, destination: string) {
  if (typeof source !== "string" || typeof destination !== "string") {
    throw new Error(`"source" and "destination" arguments must be of type string.`)
  }

  // source exists
  if (!fs.existsSync(source)) {
    throw new Error(`source "${source}" doesn't exist.`)
  }

  // read source
  const csvFile = fs.readFileSync(source, "utf-8")

  // csv parser options
  const csvOptions = {
    columns: true,
    delimiter: ",",
    ltrim: true,
    rtrim: true,
  }

  // get records
  const records = csv(csvFile, csvOptions)

  // prepare the xlsx workbook
  const wb = xlsx.utils.book_new()

  // insert the records as a sheet
  const ws = xlsx.utils.json_to_sheet(records)
  xlsx.utils.book_append_sheet(wb, ws)

  // write the xlsx workbook to destination
  xlsx.writeFile(wb, String(destination))
}
