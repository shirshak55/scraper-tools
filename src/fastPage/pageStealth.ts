// Every bit of the following code is derived from
// https://github.com/berstend/puppeteer-extra/tree/master/packages/puppeteer-extra-plugin-stealth/evasions
import { Page } from "../index"
import { withUtilsInitScript } from "./withUtils"
import utils from "./utils"

declare var window: any

export default async function pageStealth(page: Page) {
  await chrome_app(page)
  await chrome_csi(page)
  await chrome_loadTimes(page)
  await chrome_runtime(page)
  await iframe_contentWindow(page)
  await media_codecs(page)
  await navigator_language(page)
  await navigator_permissions(page)
  await navigor_plugins(page)
  await navigator_vendor(page)
  await navigator_webdriver(page)
  await source_url(page)

  // not needed since we patch in fast page
  // await user_agent_override(page)
  await webgl_vendor(page)
  await window_outerdimensions(page)
}

async function chrome_app(page: Page) {
  await withUtilsInitScript(page.context(), () => {
    if (!window.chrome) {
      // Use the exact property descriptor found in headful Chrome
      // fetch it via `Object.getOwnPropertyDescriptor(window, 'chrome')`
      Object.defineProperty(window, "chrome", {
        writable: true,
        enumerable: true,
        configurable: false, // note!
        value: {}, // We'll extend that later
      })
    }

    // That means we're running headful and don't need to mock anything
    if ("app" in window.chrome) {
      return // Nothing to do here
    }

    const makeError = {
      ErrorInInvocation: (fn: any) => {
        const err = new TypeError(`Error in invocation of app.${fn}()`)
        return utils.stripErrorWithAnchor(err, `at ${fn} (eval at <anonymous>`)
      },
    }

    // There's a some static data in that property which doesn't seem to change,
    // we should periodically check for updates: `JSON.stringify(window.app, null, 2)`
    const STATIC_DATA = JSON.parse(
      `{
            "isInstalled": false,
            "InstallState": {
              "DISABLED": "disabled",
              "INSTALLED": "installed",
              "NOT_INSTALLED": "not_installed"
            },
            "RunningState": {
              "CANNOT_RUN": "cannot_run",
              "READY_TO_RUN": "ready_to_run",
              "RUNNING": "running"
            }
            }`.trim()
    )

    window.chrome.app = {
      ...STATIC_DATA,

      get isInstalled() {
        return false
      },

      getDetails: function getDetails() {
        if (arguments.length) {
          throw makeError.ErrorInInvocation(`getDetails`)
        }
        return null
      },
      getIsInstalled: function getDetails() {
        if (arguments.length) {
          throw makeError.ErrorInInvocation(`getIsInstalled`)
        }
        return false
      },
      runningState: function getDetails() {
        if (arguments.length) {
          throw makeError.ErrorInInvocation(`runningState`)
        }
        return "cannot_run"
      },
    }
  })
}

async function chrome_csi(page: Page) {
  await withUtilsInitScript(page.context(), () => {
    if (!window.chrome) {
      // Use the exact property descriptor found in headful Chrome
      // fetch it via `Object.getOwnPropertyDescriptor(window, 'chrome')`
      Object.defineProperty(window, "chrome", {
        writable: true,
        enumerable: true,
        configurable: false, // note!
        value: {}, // We'll extend that later
      })
    }

    // That means we're running headful and don't need to mock anything
    if ("csi" in window.chrome) {
      return // Nothing to do here
    }

    // Check that the Navigation Timing API v1 is available, we need that
    if (!window.performance || !window.performance.timing) {
      return
    }

    const { timing } = window.performance

    window.chrome.csi = function () {
      return {
        onloadT: timing.domContentLoadedEventEnd,
        startE: timing.navigationStart,
        pageT: Date.now() - timing.navigationStart,
        tran: 15, // Transition type or something
      }
    }
    utils.patchToString(window.chrome.csi)
  })
}

async function chrome_loadTimes(page: Page) {
  function fun(utils: any) {
    if (!window.chrome) {
      // Use the exact property descriptor found in headful Chrome
      // fetch it via `Object.getOwnPropertyDescriptor(window, 'chrome')`
      Object.defineProperty(window, "chrome", {
        writable: true,
        enumerable: true,
        configurable: false, // note!
        value: {}, // We'll extend that later
      })
    }

    // That means we're running headful and don't need to mock anything
    if ("loadTimes" in window.chrome) {
      return // Nothing to do here
    }

    // Check that the Navigation Timing API v1 + v2 is available, we need that
    if (!window.performance || !window.performance.timing || !window.PerformancePaintTiming) {
      return
    }

    const { performance } = window

    // Some stuff is not available on about:blank as it requires a navigation to occur,
    // let's harden the code to not fail then:
    const ntEntryFallback = {
      nextHopProtocol: "h2",
      type: "other",
    }

    // The API exposes some funky info regarding the connection
    const protocolInfo = {
      get connectionInfo() {
        const ntEntry = performance.getEntriesByType("navigation")[0] || ntEntryFallback
        return ntEntry.nextHopProtocol
      },
      get npnNegotiatedProtocol() {
        // NPN is deprecated in favor of ALPN, but this implementation returns the
        // HTTP/2 or HTTP2+QUIC/39 requests negotiated via ALPN.
        const ntEntry = performance.getEntriesByType("navigation")[0] || ntEntryFallback
        return ["h2", "hq"].includes(ntEntry.nextHopProtocol) ? ntEntry.nextHopProtocol : "unknown"
      },
      get navigationType() {
        const ntEntry = performance.getEntriesByType("navigation")[0] || ntEntryFallback
        return ntEntry.type
      },
      get wasAlternateProtocolAvailable() {
        // The Alternate-Protocol header is deprecated in favor of Alt-Svc
        // (https://www.mnot.net/blog/2016/03/09/alt-svc), so technically this
        // should always return false.
        return false
      },
      get wasFetchedViaSpdy() {
        // SPDY is deprecated in favor of HTTP/2, but this implementation returns
        // true for HTTP/2 or HTTP2+QUIC/39 as well.
        const ntEntry = performance.getEntriesByType("navigation")[0] || ntEntryFallback
        return ["h2", "hq"].includes(ntEntry.nextHopProtocol)
      },
      get wasNpnNegotiated() {
        // NPN is deprecated in favor of ALPN, but this implementation returns true
        // for HTTP/2 or HTTP2+QUIC/39 requests negotiated via ALPN.
        const ntEntry = performance.getEntriesByType("navigation")[0] || ntEntryFallback
        return ["h2", "hq"].includes(ntEntry.nextHopProtocol)
      },
    }

    const { timing } = window.performance

    // Truncate number to specific number of decimals, most of the `loadTimes` stuff has 3
    function toFixed(num: any, fixed: any) {
      var re = new RegExp("^-?\\d+(?:.\\d{0," + (fixed || -1) + "})?")
      return num.toString().match(re)[0]
    }

    const timingInfo = {
      get firstPaintAfterLoadTime() {
        // This was never actually implemented and always returns 0.
        return 0
      },
      get requestTime() {
        return timing.navigationStart / 1000
      },
      get startLoadTime() {
        return timing.navigationStart / 1000
      },
      get commitLoadTime() {
        return timing.responseStart / 1000
      },
      get finishDocumentLoadTime() {
        return timing.domContentLoadedEventEnd / 1000
      },
      get finishLoadTime() {
        return timing.loadEventEnd / 1000
      },
      get firstPaintTime() {
        const fpEntry = performance.getEntriesByType("paint")[0] || {
          startTime: timing.loadEventEnd / 1000, // Fallback if no navigation occured (`about:blank`)
        }
        return toFixed((fpEntry.startTime + performance.timeOrigin) / 1000, 3)
      },
    }

    window.chrome.loadTimes = function () {
      return {
        ...protocolInfo,
        ...timingInfo,
      }
    }

    utils.patchToString(window.chrome.loadTimes)
  }
  await withUtilsInitScript(page.context(), fun, utils)
}

async function chrome_runtime(page: Page) {
  function fun(utils: any, { opts, STATIC_DATA }: { opts: any; STATIC_DATA: any }) {
    if (!window.chrome) {
      // Use the exact property descriptor found in headful Chrome
      // fetch it via `Object.getOwnPropertyDescriptor(window, 'chrome')`
      Object.defineProperty(window, "chrome", {
        writable: true,
        enumerable: true,
        configurable: false, // note!
        value: {}, // We'll extend that later
      })
    }

    // That means we're running headful and don't need to mock anything
    const existsAlready = "runtime" in window.chrome
    // `chrome.runtime` is only exposed on secure origins
    const isNotSecure = !window.location.protocol.startsWith("https")
    if (existsAlready || (isNotSecure && !opts.runOnInsecureOrigins)) {
      return // Nothing to do here
    }

    window.chrome.runtime = {
      // There's a bunch of static data in that property which doesn't seem to change,
      // we should periodically check for updates: `JSON.stringify(window.chrome.runtime, null, 2)`
      ...STATIC_DATA,
      // `chrome.runtime.id` is extension related and returns undefined in Chrome
      get id() {
        return undefined
      },
      // These two require more sophisticated mocks
      connect: null,
      sendMessage: null,
    }

    const makeCustomRuntimeErrors = (preamble: any, method: any, extensionId: any) => ({
      NoMatchingSignature: new TypeError(preamble + `No matching signature.`),
      MustSpecifyExtensionID: new TypeError(
        preamble +
          `${method} called from a webpage must specify an Extension ID (string) for its first argument.`
      ),
      InvalidExtensionID: new TypeError(preamble + `Invalid extension id: '${extensionId}'`),
    })

    // Valid Extension IDs are 32 characters in length and use the letter `a` to `p`:
    // https://source.chromium.org/chromium/chromium/src/+/master:components/crx_file/id_util.cc;drc=14a055ccb17e8c8d5d437fe080faba4c6f07beac;l=90
    const isValidExtensionID = (str: any) =>
      str.length === 32 && str.toLowerCase().match(/^[a-p]+$/)

    /** Mock `chrome.runtime.sendMessage` */
    const sendMessageHandler = {
      apply: function (target: any, ctx: any, args: any) {
        const [extensionId, options, responseCallback] = args || []

        // Define custom errors
        const errorPreamble = `Error in invocation of runtime.sendMessage(optional string extensionId, any message, optional object options, optional function responseCallback): `
        const Errors = makeCustomRuntimeErrors(
          errorPreamble,
          `chrome.runtime.sendMessage()`,
          extensionId
        )

        // Check if the call signature looks ok
        const noArguments = args.length === 0
        const tooManyArguments = args.length > 4
        const incorrectOptions = options && typeof options !== "object"
        const incorrectResponseCallback = responseCallback && typeof responseCallback !== "function"
        if (noArguments || tooManyArguments || incorrectOptions || incorrectResponseCallback) {
          throw Errors.NoMatchingSignature
        }

        // At least 2 arguments are required before we even validate the extension ID
        if (args.length < 2) {
          throw Errors.MustSpecifyExtensionID
        }

        // Now let's make sure we got a string as extension ID
        if (typeof extensionId !== "string") {
          throw Errors.NoMatchingSignature
        }

        if (!isValidExtensionID(extensionId)) {
          throw Errors.InvalidExtensionID
        }

        return undefined // Normal behavior
      },
    }
    utils.mockWithProxy(
      window.chrome.runtime,
      "sendMessage",
      function sendMessage() {},
      sendMessageHandler
    )

    /**
     * Mock `chrome.runtime.connect`
     *
     * @see https://developer.chrome.com/apps/runtime#method-connect
     */
    const connectHandler = {
      apply: function (target: any, ctx: any, args: any) {
        const [extensionId, connectInfo] = args || []

        // Define custom errors
        const errorPreamble = `Error in invocation of runtime.connect(optional string extensionId, optional object connectInfo): `
        const Errors = makeCustomRuntimeErrors(
          errorPreamble,
          `chrome.runtime.connect()`,
          extensionId
        )

        // Behavior differs a bit from sendMessage:
        const noArguments = args.length === 0
        const emptyStringArgument = args.length === 1 && extensionId === ""
        if (noArguments || emptyStringArgument) {
          throw Errors.MustSpecifyExtensionID
        }

        const tooManyArguments = args.length > 2
        const incorrectConnectInfoType = connectInfo && typeof connectInfo !== "object"

        if (tooManyArguments || incorrectConnectInfoType) {
          throw Errors.NoMatchingSignature
        }

        const extensionIdIsString = typeof extensionId === "string"
        if (extensionIdIsString && extensionId === "") {
          throw Errors.MustSpecifyExtensionID
        }
        if (extensionIdIsString && !isValidExtensionID(extensionId)) {
          throw Errors.InvalidExtensionID
        }

        // There's another edge-case here: extensionId is optional so we might find a connectInfo object as first param, which we need to validate
        const validateConnectInfo = (ci: any) => {
          // More than a first param connectInfo as been provided
          if (args.length > 1) {
            throw Errors.NoMatchingSignature
          }
          // An empty connectInfo has been provided
          if (Object.keys(ci).length === 0) {
            throw Errors.MustSpecifyExtensionID
          }
          // Loop over all connectInfo props an check them
          Object.entries(ci).forEach(([k, v]) => {
            const isExpected = ["name", "includeTlsChannelId"].includes(k)
            if (!isExpected) {
              throw new TypeError(errorPreamble + `Unexpected property: '${k}'.`)
            }
            const MismatchError = (propName: any, expected: any, found: any) =>
              TypeError(
                errorPreamble +
                  `Error at property '${propName}': Invalid type: expected ${expected}, found ${found}.`
              )
            if (k === "name" && typeof v !== "string") {
              throw MismatchError(k, "string", typeof v)
            }
            if (k === "includeTlsChannelId" && typeof v !== "boolean") {
              throw MismatchError(k, "boolean", typeof v)
            }
          })
        }
        if (typeof extensionId === "object") {
          validateConnectInfo(extensionId)
          throw Errors.MustSpecifyExtensionID
        }

        // Unfortunately even when the connect fails Chrome will return an object with methods we need to mock as well
        return utils.patchToStringNested(makeConnectResponse())
      },
    }
    utils.mockWithProxy(window.chrome.runtime, "connect", function connect() {}, connectHandler)

    function makeConnectResponse() {
      const onSomething = () => ({
        addListener: function addListener() {},
        dispatch: function dispatch() {},
        hasListener: function hasListener() {},
        hasListeners: function hasListeners() {
          return false
        },
        removeListener: function removeListener() {},
      })

      const response = {
        name: "",
        sender: undefined,
        disconnect: function disconnect() {},
        onDisconnect: onSomething(),
        onMessage: onSomething(),
        postMessage: function postMessage() {
          if (!arguments.length) {
            throw new TypeError(`Insufficient number of arguments.`)
          }
          throw new Error(`Attempting to use a disconnected port object`)
        },
      }
      return response
    }
  }
  await withUtilsInitScript(page.context(), fun, {
    opts: {},
    STATIC_DATA: JSON.parse(`{
      "OnInstalledReason": {
        "CHROME_UPDATE": "chrome_update",
        "INSTALL": "install",
        "SHARED_MODULE_UPDATE": "shared_module_update",
        "UPDATE": "update"
      },
      "OnRestartRequiredReason": {
        "APP_UPDATE": "app_update",
        "OS_UPDATE": "os_update",
        "PERIODIC": "periodic"
      },
      "PlatformArch": {
        "ARM": "arm",
        "ARM64": "arm64",
        "MIPS": "mips",
        "MIPS64": "mips64",
        "X86_32": "x86-32",
        "X86_64": "x86-64"
      },
      "PlatformNaclArch": {
        "ARM": "arm",
        "MIPS": "mips",
        "MIPS64": "mips64",
        "X86_32": "x86-32",
        "X86_64": "x86-64"
      },
      "PlatformOs": {
        "ANDROID": "android",
        "CROS": "cros",
        "LINUX": "linux",
        "MAC": "mac",
        "OPENBSD": "openbsd",
        "WIN": "win"
      },
      "RequestUpdateCheckStatus": {
        "NO_UPDATE": "no_update",
        "THROTTLED": "throttled",
        "UPDATE_AVAILABLE": "update_available"
      }
    }`),
  })
}

async function iframe_contentWindow(page: Page) {
  function fun(utils: any) {
    try {
      // Adds a contentWindow proxy to the provided iframe element
      const addContentWindowProxy = (iframe: any) => {
        const contentWindowProxy = {
          get(target: any, key: any) {
            // Now to the interesting part:
            // We actually make this thing behave like a regular iframe window,
            // by intercepting calls to e.g. `.self` and redirect it to the correct thing. :)
            // That makes it possible for these assertions to be correct:
            // iframe.contentWindow.self === window.top // must be false
            if (key === "self") {
              return this
            }
            // iframe.contentWindow.frameElement === iframe // must be true
            if (key === "frameElement") {
              return iframe
            }
            return Reflect.get(target, key)
          },
        }

        if (!iframe.contentWindow) {
          const proxy = new Proxy(window, contentWindowProxy)
          Object.defineProperty(iframe, "contentWindow", {
            get() {
              return proxy
            },
            set(newValue) {
              return newValue // contentWindow is immutable
            },
            enumerable: true,
            configurable: false,
          })
        }
      }

      // Handles iframe element creation, augments `srcdoc` property so we can intercept further
      const handleIframeCreation = (target: any, thisArg: any, args: any) => {
        const iframe = target.apply(thisArg, args)

        // We need to keep the originals around
        const _iframe = iframe
        const _srcdoc = _iframe.srcdoc

        // Add hook for the srcdoc property
        // We need to be very surgical here to not break other iframes by accident
        Object.defineProperty(iframe, "srcdoc", {
          configurable: true, // Important, so we can reset this later
          get: function () {
            return _iframe.srcdoc
          },
          set: function (newValue) {
            addContentWindowProxy(this)
            // Reset property, the hook is only needed once
            Object.defineProperty(iframe, "srcdoc", {
              configurable: false,
              writable: false,
              value: _srcdoc,
            })
            _iframe.srcdoc = newValue
          },
        })
        return iframe
      }

      // Adds a hook to intercept iframe creation events
      const addIframeCreationSniffer = () => {
        /* global document */
        const createElement = {
          // Make toString() native
          get(target: any, key: any) {
            return Reflect.get(target, key)
          },
          apply: function (target: any, thisArg: any, args: any) {
            const isIframe = args && args.length && `${args[0]}`.toLowerCase() === "iframe"
            if (!isIframe) {
              // Everything as usual
              return target.apply(thisArg, args)
            } else {
              return handleIframeCreation(target, thisArg, args)
            }
          },
        }
        // All this just due to iframes with srcdoc bug
        document.createElement = new Proxy(document.createElement, createElement)
      }

      // Let's go
      addIframeCreationSniffer()
    } catch (err) {
      // console.warn(err)
    }
  }
  await withUtilsInitScript(page.context(), fun, utils)
}

async function media_codecs(page: Page) {
  function fun(utils: any) {
    /**
     * Input might look funky, we need to normalize it so e.g. whitespace isn't an issue for our spoofing.
     *
     * @example
     * video/webm; codecs="vp8, vorbis"
     * video/mp4; codecs="avc1.42E01E"
     * audio/x-m4a;
     * audio/ogg; codecs="vorbis"
     * @param {String} arg
     */
    const parseInput = (arg: any) => {
      const [mime, codecStr] = arg.trim().split(";")
      let codecs = []
      if (codecStr && codecStr.includes('codecs="')) {
        codecs = codecStr
          .trim()
          .replace(`codecs="`, "")
          .replace(`"`, "")
          .trim()
          .split(",")
          .filter((x: any) => !!x)
          .map((x: any) => x.trim())
      }
      return {
        mime,
        codecStr,
        codecs,
      }
    }

    const canPlayType = {
      // Intercept certain requests
      apply: function (target: any, ctx: any, args: any) {
        if (!args || !args.length) {
          return target.apply(ctx, args)
        }
        const { mime, codecs } = parseInput(args[0])
        // This specific mp4 codec is missing in Chromium
        if (mime === "video/mp4") {
          if (codecs.includes("avc1.42E01E")) {
            return "probably"
          }
        }
        // This mimetype is only supported if no codecs are specified
        if (mime === "audio/x-m4a" && !codecs.length) {
          return "maybe"
        }

        // This mimetype is only supported if no codecs are specified
        if (mime === "audio/aac" && !codecs.length) {
          return "probably"
        }
        // Everything else as usual
        return target.apply(ctx, args)
      },
    }

    /* global HTMLMediaElement */
    utils.replaceWithProxy(HTMLMediaElement.prototype, "canPlayType", canPlayType)
  }
  await withUtilsInitScript(page.context(), fun, utils)
}

async function navigator_language(page: Page) {
  function fun(utils: any) {
    Object.defineProperty(Object.getPrototypeOf(navigator), "languages", {
      get: () => ["en-US", "en"],
    })
  }
  await withUtilsInitScript(page.context(), fun, utils)
}

async function navigator_permissions(page: Page) {
  function fun(utils: any) {
    const handler = {
      apply: function (target: any, ctx: any, args: any) {
        const param = (args || [])[0]

        if (param && param.name && param.name === "notifications") {
          const result = { state: Notification.permission }
          Object.setPrototypeOf(result, PermissionStatus.prototype)
          return Promise.resolve(result)
        }

        return utils.cache.Reflect.apply(...arguments)
      },
    }

    utils.replaceWithProxy(
      window.navigator.permissions.__proto__, // eslint-disable-line no-proto
      "query",
      handler
    )
  }
  await withUtilsInitScript(page.context(), fun, utils)
}

async function navigor_plugins(page: Page) {
  function fun(utils: any, { fns, data }: { fns: any; data: any }) {
    fns = utils.materializeFns(fns)

    // That means we're running headful
    const hasPlugins = "plugins" in navigator && navigator.plugins.length
    if (hasPlugins) {
      return // nothing to do here
    }

    const mimeTypes = fns.generateMimeTypeArray(utils, fns)(data.mimeTypes)
    const plugins = fns.generatePluginArray(utils, fns)(data.plugins)

    // Plugin and MimeType cross-reference each other, let's do that now
    // Note: We're looping through `data.plugins` here, not the generated `plugins`
    for (const pluginData of data.plugins) {
      pluginData.__mimeTypes.forEach((type: any, index: any) => {
        plugins[pluginData.name][index] = mimeTypes[type]

        Object.defineProperty(plugins[pluginData.name], type, {
          value: mimeTypes[type],
          writable: false,
          enumerable: false, // Not enumerable
          configurable: true,
        })
        Object.defineProperty(mimeTypes[type], "enabledPlugin", {
          value: new Proxy(plugins[pluginData.name], {}), // Prevent circular references
          writable: false,
          enumerable: false, // Important: `JSON.stringify(navigator.plugins)`
          configurable: true,
        })
      })
    }

    const patchNavigator = (name: any, value: any) =>
      utils.replaceProperty(Object.getPrototypeOf(navigator), name, {
        get() {
          return value
        },
      })

    patchNavigator("mimeTypes", mimeTypes)
    patchNavigator("plugins", plugins)
  }

  let generateMagicArray = (utils: any, fns: any) =>
    function (
      dataArray = [],
      proto = MimeTypeArray.prototype,
      itemProto = MimeType.prototype,
      itemMainProp = "type"
    ) {
      // Quick helper to set props with the same descriptors vanilla is using
      const defineProp = (obj: any, prop: any, value: any) =>
        Object.defineProperty(obj, prop, {
          value,
          writable: false,
          enumerable: false, // Important for mimeTypes & plugins: `JSON.stringify(navigator.mimeTypes)`
          configurable: true,
        })

      // Loop over our fake data and construct items
      const makeItem = (data: any) => {
        const item = {}
        for (const prop of Object.keys(data)) {
          if (prop.startsWith("__")) {
            continue
          }
          defineProp(item, prop, data[prop])
        }
        return patchItem(item, data)
      }

      const patchItem = (item: any, data: any) => {
        let descriptor = Object.getOwnPropertyDescriptors(item)

        // Special case: Plugins have a magic length property which is not enumerable
        // e.g. `navigator.plugins[i].length` should always be the length of the assigned mimeTypes
        if ((itemProto as any) === (Plugin.prototype as any)) {
          descriptor = {
            ...descriptor,
            length: {
              value: data.__mimeTypes.length,
              writable: false,
              enumerable: false,
              configurable: true, // Important to be able to use the ownKeys trap in a Proxy to strip `length`
            },
          }
        }

        // We need to spoof a specific `MimeType` or `Plugin` object
        const obj = Object.create(itemProto, descriptor)

        // Virtually all property keys are not enumerable in vanilla
        const blacklist = [...Object.keys(data), "length", "enabledPlugin"]
        return new Proxy(obj, {
          ownKeys(target) {
            return Reflect.ownKeys(target).filter((k) => !blacklist.includes(k as any))
          },
          getOwnPropertyDescriptor(target, prop) {
            if (blacklist.includes(prop as any)) {
              return undefined
            }
            return Reflect.getOwnPropertyDescriptor(target, prop)
          },
        })
      }

      const magicArray: Array<any> = []

      // Loop through our fake data and use that to create convincing entities
      dataArray.forEach((data) => {
        magicArray.push(makeItem(data))
      })

      // Add direct property access  based on types (e.g. `obj['application/pdf']`) afterwards
      magicArray.forEach((entry) => {
        defineProp(magicArray, entry[itemMainProp], entry)
      })

      // This is the best way to fake the type to make sure this is false: `Array.isArray(navigator.mimeTypes)`
      let tt: any = {
        ...Object.getOwnPropertyDescriptors(magicArray),

        // There's one ugly quirk we unfortunately need to take care of:
        // The `MimeTypeArray` prototype has an enumerable `length` property,
        // but headful Chrome will still skip it when running `Object.getOwnPropertyNames(navigator.mimeTypes)`.
        // To strip it we need to make it first `configurable` and can then overlay a Proxy with an `ownKeys` trap.
        length: {
          value: magicArray.length,
          writable: false,
          enumerable: false,
          configurable: true, // Important to be able to use the ownKeys trap in a Proxy to strip `length`
        },
      }
      const magicArrayObj = Object.create(proto, tt)

      // Generate our functional function mocks :-)
      const functionMocks = fns.generateFunctionMocks(utils)(proto, itemMainProp, magicArray)

      // We need to overlay our custom object with a JS Proxy
      const magicArrayObjProxy = new Proxy(magicArrayObj, {
        get(target, key = "") {
          // Redirect function calls to our custom proxied versions mocking the vanilla behavior
          if (key === "item") {
            return functionMocks.item
          }
          if (key === "namedItem") {
            return functionMocks.namedItem
          }
          if ((proto as any) === (PluginArray.prototype as any) && key === "refresh") {
            return functionMocks.refresh
          }
          // Everything else can pass through as normal
          return utils.cache.Reflect.get(...arguments)
        },
        ownKeys(target) {
          // There are a couple of quirks where the original property demonstrates "magical" behavior that makes no sense
          // This can be witnessed when calling `Object.getOwnPropertyNames(navigator.mimeTypes)` and the absense of `length`
          // My guess is that it has to do with the recent change of not allowing data enumeration and this being implemented weirdly
          // For that reason we just completely fake the available property names based on our data to match what regular Chrome is doing
          // Specific issues when not patching this: `length` property is available, direct `types` props (e.g. `obj['application/pdf']`) are missing
          const keys: Array<any> = []
          const typeProps = magicArray.map((mt) => mt[itemMainProp])
          typeProps.forEach((_, i) => keys.push(`${i}`))
          typeProps.forEach((propName) => keys.push(propName))
          return keys
        },
        getOwnPropertyDescriptor(target, prop) {
          if (prop === "length") {
            return undefined
          }
          return Reflect.getOwnPropertyDescriptor(target, prop)
        },
      })

      return magicArrayObjProxy
    }

  let generateFunctionMocks = (utils: any) => (proto: any, itemMainProp: any, dataArray: any) => ({
    /** Returns the MimeType object with the specified index. */
    item: utils.createProxy(proto.item, {
      apply(target: any, ctx: any, args: any) {
        if (!args.length) {
          throw new TypeError(
            `Failed to execute 'item' on '${
              proto[Symbol.toStringTag]
            }': 1 argument required, but only 0 present.`
          )
        }
        // Special behavior alert:
        // - Vanilla tries to cast strings to Numbers (only integers!) and use them as property index lookup
        // - If anything else than an integer (including as string) is provided it will return the first entry
        const isInteger = args[0] && Number.isInteger(Number(args[0])) // Cast potential string to number first, then check for integer
        // Note: Vanilla never returns `undefined`
        return (isInteger ? dataArray[Number(args[0])] : dataArray[0]) || null
      },
    }),
    /** Returns the MimeType object with the specified name. */
    namedItem: utils.createProxy(proto.namedItem, {
      apply(target: any, ctx: any, args: any) {
        if (!args.length) {
          throw new TypeError(
            `Failed to execute 'namedItem' on '${
              proto[Symbol.toStringTag]
            }': 1 argument required, but only 0 present.`
          )
        }
        return dataArray.find((mt: any) => mt[itemMainProp] === args[0]) || null // Not `undefined`!
      },
    }),
    /** Does nothing and shall return nothing */
    refresh: proto.refresh
      ? utils.createProxy(proto.refresh, {
          apply(target: any, ctx: any, args: any) {
            return undefined
          },
        })
      : undefined,
  })

  await withUtilsInitScript(page.context(), fun, utils, {
    // We pass some functions to evaluate to structure the code more nicely
    fns: utils.stringifyFns({
      generateMimeTypeArray: (utils: any, fns: any) => (mimeTypesData: any) => {
        return fns.generateMagicArray(utils, fns)(
          mimeTypesData,
          MimeTypeArray.prototype,
          MimeType.prototype,
          "type"
        )
      },
      generatePluginArray: (utils: any, fns: any) => (pluginsData: any) => {
        return fns.generateMagicArray(utils, fns)(
          pluginsData,
          PluginArray.prototype,
          Plugin.prototype,
          "name"
        )
      },
      generateMagicArray,
      generateFunctionMocks,
    }),
    data: JSON.parse(`{
      "mimeTypes": [
        {
          "type": "application/pdf",
          "suffixes": "pdf",
          "description": "",
          "__pluginName": "Chrome PDF Viewer"
        },
        {
          "type": "application/x-google-chrome-pdf",
          "suffixes": "pdf",
          "description": "Portable Document Format",
          "__pluginName": "Chrome PDF Plugin"
        },
        {
          "type": "application/x-nacl",
          "suffixes": "",
          "description": "Native Client Executable",
          "__pluginName": "Native Client"
        },
        {
          "type": "application/x-pnacl",
          "suffixes": "",
          "description": "Portable Native Client Executable",
          "__pluginName": "Native Client"
        }
      ],
      "plugins": [
        {
          "name": "Chrome PDF Plugin",
          "filename": "internal-pdf-viewer",
          "description": "Portable Document Format",
          "__mimeTypes": ["application/x-google-chrome-pdf"]
        },
        {
          "name": "Chrome PDF Viewer",
          "filename": "mhjfbmdgcfjbbpaeojofohoefgiehjai",
          "description": "",
          "__mimeTypes": ["application/pdf"]
        },
        {
          "name": "Native Client",
          "filename": "internal-nacl-plugin",
          "description": "",
          "__mimeTypes": ["application/x-nacl", "application/x-pnacl"]
        }
      ]
    }`),
  })
}

async function navigator_vendor(page: Page) {
  function fun(utils: any) {
    Object.defineProperty(Object.getPrototypeOf(navigator), "vendor", {
      get: () => "Google Inc.",
    })
  }
  await withUtilsInitScript(page.context(), fun, utils)
}

async function navigator_webdriver(page: Page) {
  function fun(utils: any) {
    delete Object.getPrototypeOf(navigator).webdriver
  }
  await withUtilsInitScript(page.context(), fun, utils)
}

async function source_url(page: Page) {
  function fun(utils: any) {}
  await withUtilsInitScript(page.context(), fun, utils)
}

async function webgl_vendor(page: Page) {
  function fun(utils: any) {
    const getParameterProxyHandler = {
      apply: function (target: any, ctx: any, args: any) {
        const param = (args || [])[0]
        // UNMASKED_VENDOR_WEBGL
        if (param === 37445) {
          return "Intel Inc." // default in headless: Google Inc.
        }
        // UNMASKED_RENDERER_WEBGL
        if (param === 37446) {
          return "Intel Iris OpenGL Engine" // default in headless: Google SwiftShader
        }
        return utils.cache.Reflect.apply(target, ctx, args)
      },
    }

    const addProxy = (obj: any, propName: any) => {
      utils.replaceWithProxy(obj, propName, getParameterProxyHandler)
    }
    // For whatever weird reason loops don't play nice with Object.defineProperty, here's the next best thing:
    addProxy(WebGLRenderingContext.prototype, "getParameter")
    addProxy(WebGL2RenderingContext.prototype, "getParameter")
  }
  await withUtilsInitScript(page.context(), fun, utils)
}

async function window_outerdimensions(page: Page) {
  function fun(utils: any) {
    try {
      if (window.outerWidth && window.outerHeight) {
        return // nothing to do here
      }
      const windowFrame = 85 // probably OS and WM dependent
      window.outerWidth = window.innerWidth
      window.outerHeight = window.innerHeight + windowFrame
    } catch (err) {}
  }
  await withUtilsInitScript(page.context(), fun, utils)
}
