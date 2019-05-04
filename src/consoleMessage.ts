import chalk from 'chalk'
import createDirectories from './createDirectories'
import path from 'path'
import fs from 'fs'
import os from 'os'
import rightPad from 'right-pad'

export default (() => {
    let desktopPath = path.join(os.homedir(), 'Desktop')
    let logFolder = createDirectories(path.join(desktopPath, 'logs'))

    const setLogFolder = (value: string) => {
        logFolder = value
    }

    const titlify = (title: string | { title: string; padding: number }) => {
        if (typeof title === 'object') {
            return rightPad(`[${title.title}]`, title.padding, ' ')
        } else {
            return `[${title}]`
        }
    }

    const logToFile = (title, content) => {
        let c = content

        try {
            let c = JSON.stringify(titlify(title) + ' ', content, null, 4)
        } catch (e) {}

        fs.appendFileSync(path.join(logFolder, 'log.txt'), '\n' + c)
    }

    const error = (title, ...s) => {
        logToFile(title, s.join(' '))
        return console.log(chalk.bgRed.green(titlify(title)), ...s)
    }
    const info = (title, ...s) => {
        logToFile(title, s.join(' '))
        console.log(chalk.bgBlue.white(titlify(title)), ...s)
    }
    const warning = (title, ...s) => {
        logToFile(title, s.join(' '))
        console.log(chalk.bgYellow.red(titlify(title)), ...s)
    }

    const success = (title, ...s) => {
        logToFile(title, s.join(' '))
        console.log(chalk.bgGreen.red(titlify(title)), ...s)
    }

    return {
        desktopPath,
        logFolder,
        setLogFolder,
        logToFile,
        error,
        info,
        warning,
        success,
    }
})()
