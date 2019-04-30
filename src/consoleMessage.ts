import chalk from 'chalk'
import createDirectories from './createDirectories'
import path from 'path'
import fs from 'fs'
import os from 'os'

const desktopPath = path.join(os.homedir(), 'Desktop')
const logFolder = createDirectories(path.join(desktopPath, 'Aliexpress_Scrapper/logs'))

export const logToFile = (content) => {
    let c = content

    try {
        let c = JSON.stringify(content, null, 4)
    } catch (e) {}

    fs.appendFileSync(path.join(logFolder, 'log.txt'), '\n' + c)
}

export const error = (...s) => {
    logToFile(s.join(' '))
    return console.log(chalk.bgRed.green(...s))
}
export const info = (...s) => {
    logToFile(s.join(' '))
    console.log(chalk.bgBlue.white(...s))
}
export const warning = (...s) => {
    logToFile(s.join(' '))
    console.log(chalk.bgYellow.red(...s))
}

export const success = (...s) => {
    logToFile(s.join(' '))
    console.log(chalk.bgGreen.red(...s))
}

export default {
    desktopPath,
    logFolder,
    logToFile,
    error,
    info,
    warning,
    success,
}
