/// # Allows you to make database request
/// Very Useful if u use mysql database to queries. I like PGSQL so in future support will be added.
import mysql from 'promise-mysql'
import AsyncLock from 'async-lock'

export default (() => {
  let lock = new AsyncLock()
  let connection = null
  return {
    setConnection: async ({
      host,
      user,
      password,
      database,
    }: {
      host: string
      user: string
      password: string
      database: string
    }) => {
      return await lock.acquire('mysqlConnection', async function() {
        if (!connection) {
          connection = await mysql.createConnection({
            host,
            user,
            password,
            database,
          })
        }
        return connection
      })
    },
    getConnection: async () => {
      if (!connection) {
        throw 'Please make connection before getting connection'
      }
      return connection
    },
  }
})()
