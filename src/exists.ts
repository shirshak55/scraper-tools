const { promisify } = require('util')
const fs = require('fs')
const stat = promisify(fs.stat)

export default async function(filePath): Promise<boolean> {
  try {
    await stat(filePath)
    return true
  } catch (err) {
    return false
  }
}
