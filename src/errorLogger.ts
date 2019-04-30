import fs from 'fs'
import util from 'util'

export default (err) => {
    console.log('[main] We got error')
    console.error(err)
    var log_file_err = fs.createWriteStream(__dirname + '../../error.log', { flags: 'a' })
    log_file_err.write(util.format('Caught exception: ' + err) + '\n')
    process.exit(1)
}
