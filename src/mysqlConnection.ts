/// # Allows you to make database request
/// Very Useful if u use mysql database to queries. I like PGSQL so in future support will be added.
import mysql from 'promise-mysql'

export default (() => {
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
      if (!connection) {
        connection = await mysql.createConnection({
          host,
          user,
          password,
          database,
        })
      }
      return connection
    },
    getConnection: () => {
      if (!connection) {
        throw 'Please make connection before getting connection'
      }
      return connection
    },
  }
})()
