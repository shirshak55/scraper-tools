import fs from 'fs'
import { error } from './consoleMessage'

export default (fileName, content) => {
    try {
        fs.writeFileSync(fileName, content)
    } catch (e) {
        error('Error while writing file:::', e)
    }
}
