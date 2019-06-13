import consoleMessage from './consoleMessage'
import node_ssh from 'node-ssh'

/// # Allows you to upload Via SSH
/// @Todo Lock

export default (() => {
  let handler
  return {
    handler: async () => {
      if (!handler) {
        throw 'No SSH Handler found'
      }
      return handler
    },
    connect: async ({
      host,
      port,
      username,
      privatekeyPath,
    }: {
      host: string
      port: string
      privatekeyPath: string
      username: string
    }) => {
      try {
        let ssh = new node_ssh()
        handler = await ssh.connect({
          host,
          port,
          username,
          privateKey: privatekeyPath,
        })
        return handler
      } catch (e) {
        consoleMessage.error('Error at ssh', e)
      }
    },
  }
})()
