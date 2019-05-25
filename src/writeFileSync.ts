import fs from 'fs'
import consoleMessage from './consoleMessage'

export default (fileName, content) => {
  try {
    fs.writeFileSync(fileName, content)
  } catch (e) {
    consoleMessage.error('Error while writing file:::', e)
  }
}
