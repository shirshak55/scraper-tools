import xlsx from 'xlsx'
import fs from 'fs'

export default (path) => {
    const table = xlsx.read(fs.readFileSync(path), { type: 'buffer' })
    var sheet_name_list = table.SheetNames
    return xlsx.utils.sheet_to_json(table.Sheets[sheet_name_list[0]])
}
