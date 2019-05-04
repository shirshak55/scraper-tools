import requestPromise from 'request-promise'
import pRetry from 'p-retry'
import consoleMessage from './consoleMessage'

let proxy = []
let currentIndex = 0

let cookie = ''
let retries = 5
let timeout = 5 * 1000

export const setProxy = (pxy) => {
    consoleMessage.success('Request Module', `Setting Proxies to`, pxy)
    currentIndex = 0
    proxy = pxy
}

export const setCookie = (c) => {
    consoleMessage.success('Request Module', `Setting Cookie to ${c}`)
    cookie = c
}

export const setRetries = (t) => {
    consoleMessage.success('Request Module', `Setting retries to ${t}`)
    retries = parseInt(t, 10)
}

export const setTout = (t) => {
    consoleMessage.success('Request Module', `Setting Timeout to ${t}`)
    timeout = parseInt(t, 10) * 1000
}

export default async (url, isMobile = false) => {
    let agent
    if (isMobile) {
        agent = `Mozilla/5.0 (Linux; Android 7.0; SM-G930V Build/NRD90M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.125 Mobile Safari/537.36`
    } else {
        agent = `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36`
    }
    let pxy = ''

    if (proxy.length === 0) {
        pxy = null
    } else {
        pxy = proxy[currentIndex++ % proxy.length]
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
                'user-agent': agent,
                'content-type': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
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
                    } attempts left. Proxy: ${pxy} Url: ${error.options.uri} Error Message: ${error.message} `,
                )
            },
        })
    } catch (e) {
        consoleMessage.error('Request Module', e)
    }
}
