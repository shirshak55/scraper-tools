import requestPromise from 'request-promise'
import pRetry from 'p-retry'
import consoleMessage from './consoleMessage'

export default (() => {
  let proxies = []
  let currentIndex = 0

  let cookie = ''
  let retries = 5
  let timeout = 5 * 1000
  let userAgent = null

  return {
    setProxy: (pxy: Array<string>) => {
      consoleMessage.success('Request Module', `Setting Proxies to`, pxy)
      currentIndex = 0
      proxies = pxy
    },

    setCookie: (c: string) => {
      consoleMessage.success('Request Module', `Setting Cookie to ${c}`)
      cookie = c
    },

    setRetries: (t: number) => {
      consoleMessage.success('Request Module', `Setting retries to ${t}`)
      retries = parseInt(t as any, 10)
    },

    setTimeout: (t: number) => {
      consoleMessage.success('Request Module', `Setting Timeout to ${t}`)
      timeout = parseInt(t as any, 10) * 1000
    },

    setUserAgent: (
      value: string = `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36`,
    ) => {
      userAgent = value
    },

    make: async (url) => {
      let pxy = ''

      if (proxies.length === 0) {
        pxy = null
      } else {
        pxy = proxies[currentIndex++ % proxies.length]
      }

      const run = async () => {
        return await requestPromise({
          debug: true,
          proxy: pxy,
          jar: true,
          strictSSL: false,
          uri: url,
          encoding: null,
          gzip: true,
          headers: {
            cookie,
            'user-agent': userAgent,
            'content-type':
              'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            'accept-language': 'en-US,en;q=0.9',
          },
          timeout,
        })
      }
      try {
        return await pRetry(run, {
          retries,
          onFailedAttempt: (error: any) => {
            console.log(
              `Attempt ${error.attemptNumber} failed. There are ${
                error.retriesLeft
              } attempts left. Proxy: ${pxy} Url: ${
                error.options.uri
              } Error Message: ${error.message} `,
            )
          },
        })
      } catch (e) {
        consoleMessage.error('Request Module', e)
      }
    },
  }
})()
