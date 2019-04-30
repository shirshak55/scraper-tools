import fs from 'fs'

export default (filename): string => {
    return fs.readFileSync(filename).toString()
}
