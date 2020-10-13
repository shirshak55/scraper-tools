"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const withUtils_1 = require("./withUtils");
const utils_1 = __importDefault(require("./utils"));
async function pageStealth(page) {
    await chrome_app(page);
    await chrome_csi(page);
    await chrome_loadTimes(page);
    await chrome_runtime(page);
    await iframe_contentWindow(page);
    await media_codecs(page);
    await navigator_language(page);
    await navigator_permissions(page);
    await navigor_plugins(page);
    await navigator_vendor(page);
    await navigator_webdriver(page);
    await source_url(page);
    await webgl_vendor(page);
    await window_outerdimensions(page);
}
exports.default = pageStealth;
async function chrome_app(page) {
    await withUtils_1.withUtilsInitScript(page.context(), () => {
        if (!window.chrome) {
            Object.defineProperty(window, "chrome", {
                writable: true,
                enumerable: true,
                configurable: false,
                value: {},
            });
        }
        if ("app" in window.chrome) {
            return;
        }
        const makeError = {
            ErrorInInvocation: (fn) => {
                const err = new TypeError(`Error in invocation of app.${fn}()`);
                return utils_1.default.stripErrorWithAnchor(err, `at ${fn} (eval at <anonymous>`);
            },
        };
        const STATIC_DATA = JSON.parse(`{
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
            }`.trim());
        window.chrome.app = {
            ...STATIC_DATA,
            get isInstalled() {
                return false;
            },
            getDetails: function getDetails() {
                if (arguments.length) {
                    throw makeError.ErrorInInvocation(`getDetails`);
                }
                return null;
            },
            getIsInstalled: function getDetails() {
                if (arguments.length) {
                    throw makeError.ErrorInInvocation(`getIsInstalled`);
                }
                return false;
            },
            runningState: function getDetails() {
                if (arguments.length) {
                    throw makeError.ErrorInInvocation(`runningState`);
                }
                return "cannot_run";
            },
        };
    });
}
async function chrome_csi(page) {
    await withUtils_1.withUtilsInitScript(page.context(), () => {
        if (!window.chrome) {
            Object.defineProperty(window, "chrome", {
                writable: true,
                enumerable: true,
                configurable: false,
                value: {},
            });
        }
        if ("csi" in window.chrome) {
            return;
        }
        if (!window.performance || !window.performance.timing) {
            return;
        }
        const { timing } = window.performance;
        window.chrome.csi = function () {
            return {
                onloadT: timing.domContentLoadedEventEnd,
                startE: timing.navigationStart,
                pageT: Date.now() - timing.navigationStart,
                tran: 15,
            };
        };
        utils_1.default.patchToString(window.chrome.csi);
    });
}
async function chrome_loadTimes(page) {
    function fun(utils) {
        if (!window.chrome) {
            Object.defineProperty(window, "chrome", {
                writable: true,
                enumerable: true,
                configurable: false,
                value: {},
            });
        }
        if ("loadTimes" in window.chrome) {
            return;
        }
        if (!window.performance || !window.performance.timing || !window.PerformancePaintTiming) {
            return;
        }
        const { performance } = window;
        const ntEntryFallback = {
            nextHopProtocol: "h2",
            type: "other",
        };
        const protocolInfo = {
            get connectionInfo() {
                const ntEntry = performance.getEntriesByType("navigation")[0] || ntEntryFallback;
                return ntEntry.nextHopProtocol;
            },
            get npnNegotiatedProtocol() {
                const ntEntry = performance.getEntriesByType("navigation")[0] || ntEntryFallback;
                return ["h2", "hq"].includes(ntEntry.nextHopProtocol) ? ntEntry.nextHopProtocol : "unknown";
            },
            get navigationType() {
                const ntEntry = performance.getEntriesByType("navigation")[0] || ntEntryFallback;
                return ntEntry.type;
            },
            get wasAlternateProtocolAvailable() {
                return false;
            },
            get wasFetchedViaSpdy() {
                const ntEntry = performance.getEntriesByType("navigation")[0] || ntEntryFallback;
                return ["h2", "hq"].includes(ntEntry.nextHopProtocol);
            },
            get wasNpnNegotiated() {
                const ntEntry = performance.getEntriesByType("navigation")[0] || ntEntryFallback;
                return ["h2", "hq"].includes(ntEntry.nextHopProtocol);
            },
        };
        const { timing } = window.performance;
        function toFixed(num, fixed) {
            var re = new RegExp("^-?\\d+(?:.\\d{0," + (fixed || -1) + "})?");
            return num.toString().match(re)[0];
        }
        const timingInfo = {
            get firstPaintAfterLoadTime() {
                return 0;
            },
            get requestTime() {
                return timing.navigationStart / 1000;
            },
            get startLoadTime() {
                return timing.navigationStart / 1000;
            },
            get commitLoadTime() {
                return timing.responseStart / 1000;
            },
            get finishDocumentLoadTime() {
                return timing.domContentLoadedEventEnd / 1000;
            },
            get finishLoadTime() {
                return timing.loadEventEnd / 1000;
            },
            get firstPaintTime() {
                const fpEntry = performance.getEntriesByType("paint")[0] || {
                    startTime: timing.loadEventEnd / 1000,
                };
                return toFixed((fpEntry.startTime + performance.timeOrigin) / 1000, 3);
            },
        };
        window.chrome.loadTimes = function () {
            return {
                ...protocolInfo,
                ...timingInfo,
            };
        };
        utils.patchToString(window.chrome.loadTimes);
    }
    await withUtils_1.withUtilsInitScript(page.context(), fun, utils_1.default);
}
async function chrome_runtime(page) {
    function fun(utils, { opts, STATIC_DATA }) {
        if (!window.chrome) {
            Object.defineProperty(window, "chrome", {
                writable: true,
                enumerable: true,
                configurable: false,
                value: {},
            });
        }
        const existsAlready = "runtime" in window.chrome;
        const isNotSecure = !window.location.protocol.startsWith("https");
        if (existsAlready || (isNotSecure && !opts.runOnInsecureOrigins)) {
            return;
        }
        window.chrome.runtime = {
            ...STATIC_DATA,
            get id() {
                return undefined;
            },
            connect: null,
            sendMessage: null,
        };
        const makeCustomRuntimeErrors = (preamble, method, extensionId) => ({
            NoMatchingSignature: new TypeError(preamble + `No matching signature.`),
            MustSpecifyExtensionID: new TypeError(preamble +
                `${method} called from a webpage must specify an Extension ID (string) for its first argument.`),
            InvalidExtensionID: new TypeError(preamble + `Invalid extension id: '${extensionId}'`),
        });
        const isValidExtensionID = (str) => str.length === 32 && str.toLowerCase().match(/^[a-p]+$/);
        const sendMessageHandler = {
            apply: function (target, ctx, args) {
                const [extensionId, options, responseCallback] = args || [];
                const errorPreamble = `Error in invocation of runtime.sendMessage(optional string extensionId, any message, optional object options, optional function responseCallback): `;
                const Errors = makeCustomRuntimeErrors(errorPreamble, `chrome.runtime.sendMessage()`, extensionId);
                const noArguments = args.length === 0;
                const tooManyArguments = args.length > 4;
                const incorrectOptions = options && typeof options !== "object";
                const incorrectResponseCallback = responseCallback && typeof responseCallback !== "function";
                if (noArguments || tooManyArguments || incorrectOptions || incorrectResponseCallback) {
                    throw Errors.NoMatchingSignature;
                }
                if (args.length < 2) {
                    throw Errors.MustSpecifyExtensionID;
                }
                if (typeof extensionId !== "string") {
                    throw Errors.NoMatchingSignature;
                }
                if (!isValidExtensionID(extensionId)) {
                    throw Errors.InvalidExtensionID;
                }
                return undefined;
            },
        };
        utils.mockWithProxy(window.chrome.runtime, "sendMessage", function sendMessage() { }, sendMessageHandler);
        const connectHandler = {
            apply: function (target, ctx, args) {
                const [extensionId, connectInfo] = args || [];
                const errorPreamble = `Error in invocation of runtime.connect(optional string extensionId, optional object connectInfo): `;
                const Errors = makeCustomRuntimeErrors(errorPreamble, `chrome.runtime.connect()`, extensionId);
                const noArguments = args.length === 0;
                const emptyStringArgument = args.length === 1 && extensionId === "";
                if (noArguments || emptyStringArgument) {
                    throw Errors.MustSpecifyExtensionID;
                }
                const tooManyArguments = args.length > 2;
                const incorrectConnectInfoType = connectInfo && typeof connectInfo !== "object";
                if (tooManyArguments || incorrectConnectInfoType) {
                    throw Errors.NoMatchingSignature;
                }
                const extensionIdIsString = typeof extensionId === "string";
                if (extensionIdIsString && extensionId === "") {
                    throw Errors.MustSpecifyExtensionID;
                }
                if (extensionIdIsString && !isValidExtensionID(extensionId)) {
                    throw Errors.InvalidExtensionID;
                }
                const validateConnectInfo = (ci) => {
                    if (args.length > 1) {
                        throw Errors.NoMatchingSignature;
                    }
                    if (Object.keys(ci).length === 0) {
                        throw Errors.MustSpecifyExtensionID;
                    }
                    Object.entries(ci).forEach(([k, v]) => {
                        const isExpected = ["name", "includeTlsChannelId"].includes(k);
                        if (!isExpected) {
                            throw new TypeError(errorPreamble + `Unexpected property: '${k}'.`);
                        }
                        const MismatchError = (propName, expected, found) => TypeError(errorPreamble +
                            `Error at property '${propName}': Invalid type: expected ${expected}, found ${found}.`);
                        if (k === "name" && typeof v !== "string") {
                            throw MismatchError(k, "string", typeof v);
                        }
                        if (k === "includeTlsChannelId" && typeof v !== "boolean") {
                            throw MismatchError(k, "boolean", typeof v);
                        }
                    });
                };
                if (typeof extensionId === "object") {
                    validateConnectInfo(extensionId);
                    throw Errors.MustSpecifyExtensionID;
                }
                return utils.patchToStringNested(makeConnectResponse());
            },
        };
        utils.mockWithProxy(window.chrome.runtime, "connect", function connect() { }, connectHandler);
        function makeConnectResponse() {
            const onSomething = () => ({
                addListener: function addListener() { },
                dispatch: function dispatch() { },
                hasListener: function hasListener() { },
                hasListeners: function hasListeners() {
                    return false;
                },
                removeListener: function removeListener() { },
            });
            const response = {
                name: "",
                sender: undefined,
                disconnect: function disconnect() { },
                onDisconnect: onSomething(),
                onMessage: onSomething(),
                postMessage: function postMessage() {
                    if (!arguments.length) {
                        throw new TypeError(`Insufficient number of arguments.`);
                    }
                    throw new Error(`Attempting to use a disconnected port object`);
                },
            };
            return response;
        }
    }
    await withUtils_1.withUtilsInitScript(page.context(), fun, {
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
    });
}
async function iframe_contentWindow(page) {
    function fun(utils) {
        try {
            const addContentWindowProxy = (iframe) => {
                const contentWindowProxy = {
                    get(target, key) {
                        if (key === "self") {
                            return this;
                        }
                        if (key === "frameElement") {
                            return iframe;
                        }
                        return Reflect.get(target, key);
                    },
                };
                if (!iframe.contentWindow) {
                    const proxy = new Proxy(window, contentWindowProxy);
                    Object.defineProperty(iframe, "contentWindow", {
                        get() {
                            return proxy;
                        },
                        set(newValue) {
                            return newValue;
                        },
                        enumerable: true,
                        configurable: false,
                    });
                }
            };
            const handleIframeCreation = (target, thisArg, args) => {
                const iframe = target.apply(thisArg, args);
                const _iframe = iframe;
                const _srcdoc = _iframe.srcdoc;
                Object.defineProperty(iframe, "srcdoc", {
                    configurable: true,
                    get: function () {
                        return _iframe.srcdoc;
                    },
                    set: function (newValue) {
                        addContentWindowProxy(this);
                        Object.defineProperty(iframe, "srcdoc", {
                            configurable: false,
                            writable: false,
                            value: _srcdoc,
                        });
                        _iframe.srcdoc = newValue;
                    },
                });
                return iframe;
            };
            const addIframeCreationSniffer = () => {
                const createElement = {
                    get(target, key) {
                        return Reflect.get(target, key);
                    },
                    apply: function (target, thisArg, args) {
                        const isIframe = args && args.length && `${args[0]}`.toLowerCase() === "iframe";
                        if (!isIframe) {
                            return target.apply(thisArg, args);
                        }
                        else {
                            return handleIframeCreation(target, thisArg, args);
                        }
                    },
                };
                document.createElement = new Proxy(document.createElement, createElement);
            };
            addIframeCreationSniffer();
        }
        catch (err) {
        }
    }
    await withUtils_1.withUtilsInitScript(page.context(), fun, utils_1.default);
}
async function media_codecs(page) {
    function fun(utils) {
        const parseInput = (arg) => {
            const [mime, codecStr] = arg.trim().split(";");
            let codecs = [];
            if (codecStr && codecStr.includes('codecs="')) {
                codecs = codecStr
                    .trim()
                    .replace(`codecs="`, "")
                    .replace(`"`, "")
                    .trim()
                    .split(",")
                    .filter((x) => !!x)
                    .map((x) => x.trim());
            }
            return {
                mime,
                codecStr,
                codecs,
            };
        };
        const canPlayType = {
            apply: function (target, ctx, args) {
                if (!args || !args.length) {
                    return target.apply(ctx, args);
                }
                const { mime, codecs } = parseInput(args[0]);
                if (mime === "video/mp4") {
                    if (codecs.includes("avc1.42E01E")) {
                        return "probably";
                    }
                }
                if (mime === "audio/x-m4a" && !codecs.length) {
                    return "maybe";
                }
                if (mime === "audio/aac" && !codecs.length) {
                    return "probably";
                }
                return target.apply(ctx, args);
            },
        };
        utils.replaceWithProxy(HTMLMediaElement.prototype, "canPlayType", canPlayType);
    }
    await withUtils_1.withUtilsInitScript(page.context(), fun, utils_1.default);
}
async function navigator_language(page) {
    function fun(utils) {
        Object.defineProperty(Object.getPrototypeOf(navigator), "languages", {
            get: () => ["en-US", "en"],
        });
    }
    await withUtils_1.withUtilsInitScript(page.context(), fun, utils_1.default);
}
async function navigator_permissions(page) {
    function fun(utils) {
        const handler = {
            apply: function (target, ctx, args) {
                const param = (args || [])[0];
                if (param && param.name && param.name === "notifications") {
                    const result = { state: Notification.permission };
                    Object.setPrototypeOf(result, PermissionStatus.prototype);
                    return Promise.resolve(result);
                }
                return utils.cache.Reflect.apply(...arguments);
            },
        };
        utils.replaceWithProxy(window.navigator.permissions.__proto__, "query", handler);
    }
    await withUtils_1.withUtilsInitScript(page.context(), fun, utils_1.default);
}
async function navigor_plugins(page) {
    function fun(utils, { fns, data }) {
        fns = utils.materializeFns(fns);
        const hasPlugins = "plugins" in navigator && navigator.plugins.length;
        if (hasPlugins) {
            return;
        }
        const mimeTypes = fns.generateMimeTypeArray(utils, fns)(data.mimeTypes);
        const plugins = fns.generatePluginArray(utils, fns)(data.plugins);
        for (const pluginData of data.plugins) {
            pluginData.__mimeTypes.forEach((type, index) => {
                plugins[pluginData.name][index] = mimeTypes[type];
                Object.defineProperty(plugins[pluginData.name], type, {
                    value: mimeTypes[type],
                    writable: false,
                    enumerable: false,
                    configurable: true,
                });
                Object.defineProperty(mimeTypes[type], "enabledPlugin", {
                    value: new Proxy(plugins[pluginData.name], {}),
                    writable: false,
                    enumerable: false,
                    configurable: true,
                });
            });
        }
        const patchNavigator = (name, value) => utils.replaceProperty(Object.getPrototypeOf(navigator), name, {
            get() {
                return value;
            },
        });
        patchNavigator("mimeTypes", mimeTypes);
        patchNavigator("plugins", plugins);
    }
    let generateMagicArray = (utils, fns) => function (dataArray = [], proto = MimeTypeArray.prototype, itemProto = MimeType.prototype, itemMainProp = "type") {
        const defineProp = (obj, prop, value) => Object.defineProperty(obj, prop, {
            value,
            writable: false,
            enumerable: false,
            configurable: true,
        });
        const makeItem = (data) => {
            const item = {};
            for (const prop of Object.keys(data)) {
                if (prop.startsWith("__")) {
                    continue;
                }
                defineProp(item, prop, data[prop]);
            }
            return patchItem(item, data);
        };
        const patchItem = (item, data) => {
            let descriptor = Object.getOwnPropertyDescriptors(item);
            if (itemProto === Plugin.prototype) {
                descriptor = {
                    ...descriptor,
                    length: {
                        value: data.__mimeTypes.length,
                        writable: false,
                        enumerable: false,
                        configurable: true,
                    },
                };
            }
            const obj = Object.create(itemProto, descriptor);
            const blacklist = [...Object.keys(data), "length", "enabledPlugin"];
            return new Proxy(obj, {
                ownKeys(target) {
                    return Reflect.ownKeys(target).filter((k) => !blacklist.includes(k));
                },
                getOwnPropertyDescriptor(target, prop) {
                    if (blacklist.includes(prop)) {
                        return undefined;
                    }
                    return Reflect.getOwnPropertyDescriptor(target, prop);
                },
            });
        };
        const magicArray = [];
        dataArray.forEach((data) => {
            magicArray.push(makeItem(data));
        });
        magicArray.forEach((entry) => {
            defineProp(magicArray, entry[itemMainProp], entry);
        });
        let tt = {
            ...Object.getOwnPropertyDescriptors(magicArray),
            length: {
                value: magicArray.length,
                writable: false,
                enumerable: false,
                configurable: true,
            },
        };
        const magicArrayObj = Object.create(proto, tt);
        const functionMocks = fns.generateFunctionMocks(utils)(proto, itemMainProp, magicArray);
        const magicArrayObjProxy = new Proxy(magicArrayObj, {
            get(target, key = "") {
                if (key === "item") {
                    return functionMocks.item;
                }
                if (key === "namedItem") {
                    return functionMocks.namedItem;
                }
                if (proto === PluginArray.prototype && key === "refresh") {
                    return functionMocks.refresh;
                }
                return utils.cache.Reflect.get(...arguments);
            },
            ownKeys(target) {
                const keys = [];
                const typeProps = magicArray.map((mt) => mt[itemMainProp]);
                typeProps.forEach((_, i) => keys.push(`${i}`));
                typeProps.forEach((propName) => keys.push(propName));
                return keys;
            },
            getOwnPropertyDescriptor(target, prop) {
                if (prop === "length") {
                    return undefined;
                }
                return Reflect.getOwnPropertyDescriptor(target, prop);
            },
        });
        return magicArrayObjProxy;
    };
    let generateFunctionMocks = (utils) => (proto, itemMainProp, dataArray) => ({
        item: utils.createProxy(proto.item, {
            apply(target, ctx, args) {
                if (!args.length) {
                    throw new TypeError(`Failed to execute 'item' on '${proto[Symbol.toStringTag]}': 1 argument required, but only 0 present.`);
                }
                const isInteger = args[0] && Number.isInteger(Number(args[0]));
                return (isInteger ? dataArray[Number(args[0])] : dataArray[0]) || null;
            },
        }),
        namedItem: utils.createProxy(proto.namedItem, {
            apply(target, ctx, args) {
                if (!args.length) {
                    throw new TypeError(`Failed to execute 'namedItem' on '${proto[Symbol.toStringTag]}': 1 argument required, but only 0 present.`);
                }
                return dataArray.find((mt) => mt[itemMainProp] === args[0]) || null;
            },
        }),
        refresh: proto.refresh
            ? utils.createProxy(proto.refresh, {
                apply(target, ctx, args) {
                    return undefined;
                },
            })
            : undefined,
    });
    await withUtils_1.withUtilsInitScript(page.context(), fun, utils_1.default, {
        fns: utils_1.default.stringifyFns({
            generateMimeTypeArray: (utils, fns) => (mimeTypesData) => {
                return fns.generateMagicArray(utils, fns)(mimeTypesData, MimeTypeArray.prototype, MimeType.prototype, "type");
            },
            generatePluginArray: (utils, fns) => (pluginsData) => {
                return fns.generateMagicArray(utils, fns)(pluginsData, PluginArray.prototype, Plugin.prototype, "name");
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
    });
}
async function navigator_vendor(page) {
    function fun(utils) {
        Object.defineProperty(Object.getPrototypeOf(navigator), "vendor", {
            get: () => "Google Inc.",
        });
    }
    await withUtils_1.withUtilsInitScript(page.context(), fun, utils_1.default);
}
async function navigator_webdriver(page) {
    function fun(utils) {
        delete Object.getPrototypeOf(navigator).webdriver;
    }
    await withUtils_1.withUtilsInitScript(page.context(), fun, utils_1.default);
}
async function source_url(page) {
    function fun(utils) { }
    await withUtils_1.withUtilsInitScript(page.context(), fun, utils_1.default);
}
async function webgl_vendor(page) {
    function fun(utils) {
        const getParameterProxyHandler = {
            apply: function (target, ctx, args) {
                const param = (args || [])[0];
                if (param === 37445) {
                    return "Intel Inc.";
                }
                if (param === 37446) {
                    return "Intel Iris OpenGL Engine";
                }
                return utils.cache.Reflect.apply(target, ctx, args);
            },
        };
        const addProxy = (obj, propName) => {
            utils.replaceWithProxy(obj, propName, getParameterProxyHandler);
        };
        addProxy(WebGLRenderingContext.prototype, "getParameter");
        addProxy(WebGL2RenderingContext.prototype, "getParameter");
    }
    await withUtils_1.withUtilsInitScript(page.context(), fun, utils_1.default);
}
async function window_outerdimensions(page) {
    function fun(utils) {
        try {
            if (window.outerWidth && window.outerHeight) {
                return;
            }
            const windowFrame = 85;
            window.outerWidth = window.innerWidth;
            window.outerHeight = window.innerHeight + windowFrame;
        }
        catch (err) { }
    }
    await withUtils_1.withUtilsInitScript(page.context(), fun, utils_1.default);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnZVN0ZWFsdGguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZmFzdFBhZ2UvcGFnZVN0ZWFsdGgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFHQSwyQ0FBaUQ7QUFDakQsb0RBQTJCO0FBSVosS0FBSyxVQUFVLFdBQVcsQ0FBQyxJQUFVO0lBQ2xELE1BQU0sVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQ3RCLE1BQU0sVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQ3RCLE1BQU0sZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDNUIsTUFBTSxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDMUIsTUFBTSxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUNoQyxNQUFNLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUN4QixNQUFNLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFBO0lBQzlCLE1BQU0scUJBQXFCLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDakMsTUFBTSxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDM0IsTUFBTSxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUM1QixNQUFNLG1CQUFtQixDQUFDLElBQUksQ0FBQyxDQUFBO0lBQy9CLE1BQU0sVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFBO0lBSXRCLE1BQU0sWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQ3hCLE1BQU0sc0JBQXNCLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDcEMsQ0FBQztBQWxCRCw4QkFrQkM7QUFFRCxLQUFLLFVBQVUsVUFBVSxDQUFDLElBQVU7SUFDbEMsTUFBTSwrQkFBbUIsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUUsR0FBRyxFQUFFO1FBQzdDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFO1lBR2xCLE1BQU0sQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRTtnQkFDdEMsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsVUFBVSxFQUFFLElBQUk7Z0JBQ2hCLFlBQVksRUFBRSxLQUFLO2dCQUNuQixLQUFLLEVBQUUsRUFBRTthQUNWLENBQUMsQ0FBQTtTQUNIO1FBR0QsSUFBSSxLQUFLLElBQUksTUFBTSxDQUFDLE1BQU0sRUFBRTtZQUMxQixPQUFNO1NBQ1A7UUFFRCxNQUFNLFNBQVMsR0FBRztZQUNoQixpQkFBaUIsRUFBRSxDQUFDLEVBQU8sRUFBRSxFQUFFO2dCQUM3QixNQUFNLEdBQUcsR0FBRyxJQUFJLFNBQVMsQ0FBQyw4QkFBOEIsRUFBRSxJQUFJLENBQUMsQ0FBQTtnQkFDL0QsT0FBTyxlQUFLLENBQUMsb0JBQW9CLENBQUMsR0FBRyxFQUFFLE1BQU0sRUFBRSx1QkFBdUIsQ0FBQyxDQUFBO1lBQ3pFLENBQUM7U0FDRixDQUFBO1FBSUQsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FDNUI7Ozs7Ozs7Ozs7OztjQVlRLENBQUMsSUFBSSxFQUFFLENBQ2hCLENBQUE7UUFFRCxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsR0FBRztZQUNsQixHQUFHLFdBQVc7WUFFZCxJQUFJLFdBQVc7Z0JBQ2IsT0FBTyxLQUFLLENBQUE7WUFDZCxDQUFDO1lBRUQsVUFBVSxFQUFFLFNBQVMsVUFBVTtnQkFDN0IsSUFBSSxTQUFTLENBQUMsTUFBTSxFQUFFO29CQUNwQixNQUFNLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxZQUFZLENBQUMsQ0FBQTtpQkFDaEQ7Z0JBQ0QsT0FBTyxJQUFJLENBQUE7WUFDYixDQUFDO1lBQ0QsY0FBYyxFQUFFLFNBQVMsVUFBVTtnQkFDakMsSUFBSSxTQUFTLENBQUMsTUFBTSxFQUFFO29CQUNwQixNQUFNLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO2lCQUNwRDtnQkFDRCxPQUFPLEtBQUssQ0FBQTtZQUNkLENBQUM7WUFDRCxZQUFZLEVBQUUsU0FBUyxVQUFVO2dCQUMvQixJQUFJLFNBQVMsQ0FBQyxNQUFNLEVBQUU7b0JBQ3BCLE1BQU0sU0FBUyxDQUFDLGlCQUFpQixDQUFDLGNBQWMsQ0FBQyxDQUFBO2lCQUNsRDtnQkFDRCxPQUFPLFlBQVksQ0FBQTtZQUNyQixDQUFDO1NBQ0YsQ0FBQTtJQUNILENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQztBQUVELEtBQUssVUFBVSxVQUFVLENBQUMsSUFBVTtJQUNsQyxNQUFNLCtCQUFtQixDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRSxHQUFHLEVBQUU7UUFDN0MsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUU7WUFHbEIsTUFBTSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFO2dCQUN0QyxRQUFRLEVBQUUsSUFBSTtnQkFDZCxVQUFVLEVBQUUsSUFBSTtnQkFDaEIsWUFBWSxFQUFFLEtBQUs7Z0JBQ25CLEtBQUssRUFBRSxFQUFFO2FBQ1YsQ0FBQyxDQUFBO1NBQ0g7UUFHRCxJQUFJLEtBQUssSUFBSSxNQUFNLENBQUMsTUFBTSxFQUFFO1lBQzFCLE9BQU07U0FDUDtRQUdELElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUU7WUFDckQsT0FBTTtTQUNQO1FBRUQsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUE7UUFFckMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEdBQUc7WUFDbEIsT0FBTztnQkFDTCxPQUFPLEVBQUUsTUFBTSxDQUFDLHdCQUF3QjtnQkFDeEMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxlQUFlO2dCQUM5QixLQUFLLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLE1BQU0sQ0FBQyxlQUFlO2dCQUMxQyxJQUFJLEVBQUUsRUFBRTthQUNULENBQUE7UUFDSCxDQUFDLENBQUE7UUFDRCxlQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUE7SUFDeEMsQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDO0FBRUQsS0FBSyxVQUFVLGdCQUFnQixDQUFDLElBQVU7SUFDeEMsU0FBUyxHQUFHLENBQUMsS0FBVTtRQUNyQixJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRTtZQUdsQixNQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUU7Z0JBQ3RDLFFBQVEsRUFBRSxJQUFJO2dCQUNkLFVBQVUsRUFBRSxJQUFJO2dCQUNoQixZQUFZLEVBQUUsS0FBSztnQkFDbkIsS0FBSyxFQUFFLEVBQUU7YUFDVixDQUFDLENBQUE7U0FDSDtRQUdELElBQUksV0FBVyxJQUFJLE1BQU0sQ0FBQyxNQUFNLEVBQUU7WUFDaEMsT0FBTTtTQUNQO1FBR0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxzQkFBc0IsRUFBRTtZQUN2RixPQUFNO1NBQ1A7UUFFRCxNQUFNLEVBQUUsV0FBVyxFQUFFLEdBQUcsTUFBTSxDQUFBO1FBSTlCLE1BQU0sZUFBZSxHQUFHO1lBQ3RCLGVBQWUsRUFBRSxJQUFJO1lBQ3JCLElBQUksRUFBRSxPQUFPO1NBQ2QsQ0FBQTtRQUdELE1BQU0sWUFBWSxHQUFHO1lBQ25CLElBQUksY0FBYztnQkFDaEIsTUFBTSxPQUFPLEdBQUcsV0FBVyxDQUFDLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLGVBQWUsQ0FBQTtnQkFDaEYsT0FBTyxPQUFPLENBQUMsZUFBZSxDQUFBO1lBQ2hDLENBQUM7WUFDRCxJQUFJLHFCQUFxQjtnQkFHdkIsTUFBTSxPQUFPLEdBQUcsV0FBVyxDQUFDLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLGVBQWUsQ0FBQTtnQkFDaEYsT0FBTyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUE7WUFDN0YsQ0FBQztZQUNELElBQUksY0FBYztnQkFDaEIsTUFBTSxPQUFPLEdBQUcsV0FBVyxDQUFDLGdCQUFnQixDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLGVBQWUsQ0FBQTtnQkFDaEYsT0FBTyxPQUFPLENBQUMsSUFBSSxDQUFBO1lBQ3JCLENBQUM7WUFDRCxJQUFJLDZCQUE2QjtnQkFJL0IsT0FBTyxLQUFLLENBQUE7WUFDZCxDQUFDO1lBQ0QsSUFBSSxpQkFBaUI7Z0JBR25CLE1BQU0sT0FBTyxHQUFHLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxlQUFlLENBQUE7Z0JBQ2hGLE9BQU8sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQTtZQUN2RCxDQUFDO1lBQ0QsSUFBSSxnQkFBZ0I7Z0JBR2xCLE1BQU0sT0FBTyxHQUFHLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxlQUFlLENBQUE7Z0JBQ2hGLE9BQU8sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQTtZQUN2RCxDQUFDO1NBQ0YsQ0FBQTtRQUVELE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFBO1FBR3JDLFNBQVMsT0FBTyxDQUFDLEdBQVEsRUFBRSxLQUFVO1lBQ25DLElBQUksRUFBRSxHQUFHLElBQUksTUFBTSxDQUFDLG1CQUFtQixHQUFHLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUE7WUFDaEUsT0FBTyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ3BDLENBQUM7UUFFRCxNQUFNLFVBQVUsR0FBRztZQUNqQixJQUFJLHVCQUF1QjtnQkFFekIsT0FBTyxDQUFDLENBQUE7WUFDVixDQUFDO1lBQ0QsSUFBSSxXQUFXO2dCQUNiLE9BQU8sTUFBTSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUE7WUFDdEMsQ0FBQztZQUNELElBQUksYUFBYTtnQkFDZixPQUFPLE1BQU0sQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFBO1lBQ3RDLENBQUM7WUFDRCxJQUFJLGNBQWM7Z0JBQ2hCLE9BQU8sTUFBTSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUE7WUFDcEMsQ0FBQztZQUNELElBQUksc0JBQXNCO2dCQUN4QixPQUFPLE1BQU0sQ0FBQyx3QkFBd0IsR0FBRyxJQUFJLENBQUE7WUFDL0MsQ0FBQztZQUNELElBQUksY0FBYztnQkFDaEIsT0FBTyxNQUFNLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQTtZQUNuQyxDQUFDO1lBQ0QsSUFBSSxjQUFjO2dCQUNoQixNQUFNLE9BQU8sR0FBRyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUk7b0JBQzFELFNBQVMsRUFBRSxNQUFNLENBQUMsWUFBWSxHQUFHLElBQUk7aUJBQ3RDLENBQUE7Z0JBQ0QsT0FBTyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxHQUFHLFdBQVcsQ0FBQyxVQUFVLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUE7WUFDeEUsQ0FBQztTQUNGLENBQUE7UUFFRCxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsR0FBRztZQUN4QixPQUFPO2dCQUNMLEdBQUcsWUFBWTtnQkFDZixHQUFHLFVBQVU7YUFDZCxDQUFBO1FBQ0gsQ0FBQyxDQUFBO1FBRUQsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFBO0lBQzlDLENBQUM7SUFDRCxNQUFNLCtCQUFtQixDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRSxHQUFHLEVBQUUsZUFBSyxDQUFDLENBQUE7QUFDdkQsQ0FBQztBQUVELEtBQUssVUFBVSxjQUFjLENBQUMsSUFBVTtJQUN0QyxTQUFTLEdBQUcsQ0FBQyxLQUFVLEVBQUUsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFtQztRQUM3RSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRTtZQUdsQixNQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUU7Z0JBQ3RDLFFBQVEsRUFBRSxJQUFJO2dCQUNkLFVBQVUsRUFBRSxJQUFJO2dCQUNoQixZQUFZLEVBQUUsS0FBSztnQkFDbkIsS0FBSyxFQUFFLEVBQUU7YUFDVixDQUFDLENBQUE7U0FDSDtRQUdELE1BQU0sYUFBYSxHQUFHLFNBQVMsSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFBO1FBRWhELE1BQU0sV0FBVyxHQUFHLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBQ2pFLElBQUksYUFBYSxJQUFJLENBQUMsV0FBVyxJQUFJLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLEVBQUU7WUFDaEUsT0FBTTtTQUNQO1FBRUQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEdBQUc7WUFHdEIsR0FBRyxXQUFXO1lBRWQsSUFBSSxFQUFFO2dCQUNKLE9BQU8sU0FBUyxDQUFBO1lBQ2xCLENBQUM7WUFFRCxPQUFPLEVBQUUsSUFBSTtZQUNiLFdBQVcsRUFBRSxJQUFJO1NBQ2xCLENBQUE7UUFFRCxNQUFNLHVCQUF1QixHQUFHLENBQUMsUUFBYSxFQUFFLE1BQVcsRUFBRSxXQUFnQixFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ2pGLG1CQUFtQixFQUFFLElBQUksU0FBUyxDQUFDLFFBQVEsR0FBRyx3QkFBd0IsQ0FBQztZQUN2RSxzQkFBc0IsRUFBRSxJQUFJLFNBQVMsQ0FDbkMsUUFBUTtnQkFDTixHQUFHLE1BQU0sc0ZBQXNGLENBQ2xHO1lBQ0Qsa0JBQWtCLEVBQUUsSUFBSSxTQUFTLENBQUMsUUFBUSxHQUFHLDBCQUEwQixXQUFXLEdBQUcsQ0FBQztTQUN2RixDQUFDLENBQUE7UUFJRixNQUFNLGtCQUFrQixHQUFHLENBQUMsR0FBUSxFQUFFLEVBQUUsQ0FDdEMsR0FBRyxDQUFDLE1BQU0sS0FBSyxFQUFFLElBQUksR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQTtRQUcxRCxNQUFNLGtCQUFrQixHQUFHO1lBQ3pCLEtBQUssRUFBRSxVQUFVLE1BQVcsRUFBRSxHQUFRLEVBQUUsSUFBUztnQkFDL0MsTUFBTSxDQUFDLFdBQVcsRUFBRSxPQUFPLEVBQUUsZ0JBQWdCLENBQUMsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFBO2dCQUczRCxNQUFNLGFBQWEsR0FBRyxxSkFBcUosQ0FBQTtnQkFDM0ssTUFBTSxNQUFNLEdBQUcsdUJBQXVCLENBQ3BDLGFBQWEsRUFDYiw4QkFBOEIsRUFDOUIsV0FBVyxDQUNaLENBQUE7Z0JBR0QsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUE7Z0JBQ3JDLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUE7Z0JBQ3hDLE1BQU0sZ0JBQWdCLEdBQUcsT0FBTyxJQUFJLE9BQU8sT0FBTyxLQUFLLFFBQVEsQ0FBQTtnQkFDL0QsTUFBTSx5QkFBeUIsR0FBRyxnQkFBZ0IsSUFBSSxPQUFPLGdCQUFnQixLQUFLLFVBQVUsQ0FBQTtnQkFDNUYsSUFBSSxXQUFXLElBQUksZ0JBQWdCLElBQUksZ0JBQWdCLElBQUkseUJBQXlCLEVBQUU7b0JBQ3BGLE1BQU0sTUFBTSxDQUFDLG1CQUFtQixDQUFBO2lCQUNqQztnQkFHRCxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO29CQUNuQixNQUFNLE1BQU0sQ0FBQyxzQkFBc0IsQ0FBQTtpQkFDcEM7Z0JBR0QsSUFBSSxPQUFPLFdBQVcsS0FBSyxRQUFRLEVBQUU7b0JBQ25DLE1BQU0sTUFBTSxDQUFDLG1CQUFtQixDQUFBO2lCQUNqQztnQkFFRCxJQUFJLENBQUMsa0JBQWtCLENBQUMsV0FBVyxDQUFDLEVBQUU7b0JBQ3BDLE1BQU0sTUFBTSxDQUFDLGtCQUFrQixDQUFBO2lCQUNoQztnQkFFRCxPQUFPLFNBQVMsQ0FBQTtZQUNsQixDQUFDO1NBQ0YsQ0FBQTtRQUNELEtBQUssQ0FBQyxhQUFhLENBQ2pCLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUNyQixhQUFhLEVBQ2IsU0FBUyxXQUFXLEtBQUksQ0FBQyxFQUN6QixrQkFBa0IsQ0FDbkIsQ0FBQTtRQU9ELE1BQU0sY0FBYyxHQUFHO1lBQ3JCLEtBQUssRUFBRSxVQUFVLE1BQVcsRUFBRSxHQUFRLEVBQUUsSUFBUztnQkFDL0MsTUFBTSxDQUFDLFdBQVcsRUFBRSxXQUFXLENBQUMsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFBO2dCQUc3QyxNQUFNLGFBQWEsR0FBRyxvR0FBb0csQ0FBQTtnQkFDMUgsTUFBTSxNQUFNLEdBQUcsdUJBQXVCLENBQ3BDLGFBQWEsRUFDYiwwQkFBMEIsRUFDMUIsV0FBVyxDQUNaLENBQUE7Z0JBR0QsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUE7Z0JBQ3JDLE1BQU0sbUJBQW1CLEdBQUcsSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksV0FBVyxLQUFLLEVBQUUsQ0FBQTtnQkFDbkUsSUFBSSxXQUFXLElBQUksbUJBQW1CLEVBQUU7b0JBQ3RDLE1BQU0sTUFBTSxDQUFDLHNCQUFzQixDQUFBO2lCQUNwQztnQkFFRCxNQUFNLGdCQUFnQixHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFBO2dCQUN4QyxNQUFNLHdCQUF3QixHQUFHLFdBQVcsSUFBSSxPQUFPLFdBQVcsS0FBSyxRQUFRLENBQUE7Z0JBRS9FLElBQUksZ0JBQWdCLElBQUksd0JBQXdCLEVBQUU7b0JBQ2hELE1BQU0sTUFBTSxDQUFDLG1CQUFtQixDQUFBO2lCQUNqQztnQkFFRCxNQUFNLG1CQUFtQixHQUFHLE9BQU8sV0FBVyxLQUFLLFFBQVEsQ0FBQTtnQkFDM0QsSUFBSSxtQkFBbUIsSUFBSSxXQUFXLEtBQUssRUFBRSxFQUFFO29CQUM3QyxNQUFNLE1BQU0sQ0FBQyxzQkFBc0IsQ0FBQTtpQkFDcEM7Z0JBQ0QsSUFBSSxtQkFBbUIsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFdBQVcsQ0FBQyxFQUFFO29CQUMzRCxNQUFNLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQTtpQkFDaEM7Z0JBR0QsTUFBTSxtQkFBbUIsR0FBRyxDQUFDLEVBQU8sRUFBRSxFQUFFO29CQUV0QyxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO3dCQUNuQixNQUFNLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQTtxQkFDakM7b0JBRUQsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7d0JBQ2hDLE1BQU0sTUFBTSxDQUFDLHNCQUFzQixDQUFBO3FCQUNwQztvQkFFRCxNQUFNLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUU7d0JBQ3BDLE1BQU0sVUFBVSxHQUFHLENBQUMsTUFBTSxFQUFFLHFCQUFxQixDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFBO3dCQUM5RCxJQUFJLENBQUMsVUFBVSxFQUFFOzRCQUNmLE1BQU0sSUFBSSxTQUFTLENBQUMsYUFBYSxHQUFHLHlCQUF5QixDQUFDLElBQUksQ0FBQyxDQUFBO3lCQUNwRTt3QkFDRCxNQUFNLGFBQWEsR0FBRyxDQUFDLFFBQWEsRUFBRSxRQUFhLEVBQUUsS0FBVSxFQUFFLEVBQUUsQ0FDakUsU0FBUyxDQUNQLGFBQWE7NEJBQ1gsc0JBQXNCLFFBQVEsNkJBQTZCLFFBQVEsV0FBVyxLQUFLLEdBQUcsQ0FDekYsQ0FBQTt3QkFDSCxJQUFJLENBQUMsS0FBSyxNQUFNLElBQUksT0FBTyxDQUFDLEtBQUssUUFBUSxFQUFFOzRCQUN6QyxNQUFNLGFBQWEsQ0FBQyxDQUFDLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUE7eUJBQzNDO3dCQUNELElBQUksQ0FBQyxLQUFLLHFCQUFxQixJQUFJLE9BQU8sQ0FBQyxLQUFLLFNBQVMsRUFBRTs0QkFDekQsTUFBTSxhQUFhLENBQUMsQ0FBQyxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFBO3lCQUM1QztvQkFDSCxDQUFDLENBQUMsQ0FBQTtnQkFDSixDQUFDLENBQUE7Z0JBQ0QsSUFBSSxPQUFPLFdBQVcsS0FBSyxRQUFRLEVBQUU7b0JBQ25DLG1CQUFtQixDQUFDLFdBQVcsQ0FBQyxDQUFBO29CQUNoQyxNQUFNLE1BQU0sQ0FBQyxzQkFBc0IsQ0FBQTtpQkFDcEM7Z0JBR0QsT0FBTyxLQUFLLENBQUMsbUJBQW1CLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxDQUFBO1lBQ3pELENBQUM7U0FDRixDQUFBO1FBQ0QsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsU0FBUyxPQUFPLEtBQUksQ0FBQyxFQUFFLGNBQWMsQ0FBQyxDQUFBO1FBRTVGLFNBQVMsbUJBQW1CO1lBQzFCLE1BQU0sV0FBVyxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUM7Z0JBQ3pCLFdBQVcsRUFBRSxTQUFTLFdBQVcsS0FBSSxDQUFDO2dCQUN0QyxRQUFRLEVBQUUsU0FBUyxRQUFRLEtBQUksQ0FBQztnQkFDaEMsV0FBVyxFQUFFLFNBQVMsV0FBVyxLQUFJLENBQUM7Z0JBQ3RDLFlBQVksRUFBRSxTQUFTLFlBQVk7b0JBQ2pDLE9BQU8sS0FBSyxDQUFBO2dCQUNkLENBQUM7Z0JBQ0QsY0FBYyxFQUFFLFNBQVMsY0FBYyxLQUFJLENBQUM7YUFDN0MsQ0FBQyxDQUFBO1lBRUYsTUFBTSxRQUFRLEdBQUc7Z0JBQ2YsSUFBSSxFQUFFLEVBQUU7Z0JBQ1IsTUFBTSxFQUFFLFNBQVM7Z0JBQ2pCLFVBQVUsRUFBRSxTQUFTLFVBQVUsS0FBSSxDQUFDO2dCQUNwQyxZQUFZLEVBQUUsV0FBVyxFQUFFO2dCQUMzQixTQUFTLEVBQUUsV0FBVyxFQUFFO2dCQUN4QixXQUFXLEVBQUUsU0FBUyxXQUFXO29CQUMvQixJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRTt3QkFDckIsTUFBTSxJQUFJLFNBQVMsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFBO3FCQUN6RDtvQkFDRCxNQUFNLElBQUksS0FBSyxDQUFDLDhDQUE4QyxDQUFDLENBQUE7Z0JBQ2pFLENBQUM7YUFDRixDQUFBO1lBQ0QsT0FBTyxRQUFRLENBQUE7UUFDakIsQ0FBQztJQUNILENBQUM7SUFDRCxNQUFNLCtCQUFtQixDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRSxHQUFHLEVBQUU7UUFDN0MsSUFBSSxFQUFFLEVBQUU7UUFDUixXQUFXLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQXdDdEIsQ0FBQztLQUNKLENBQUMsQ0FBQTtBQUNKLENBQUM7QUFFRCxLQUFLLFVBQVUsb0JBQW9CLENBQUMsSUFBVTtJQUM1QyxTQUFTLEdBQUcsQ0FBQyxLQUFVO1FBQ3JCLElBQUk7WUFFRixNQUFNLHFCQUFxQixHQUFHLENBQUMsTUFBVyxFQUFFLEVBQUU7Z0JBQzVDLE1BQU0sa0JBQWtCLEdBQUc7b0JBQ3pCLEdBQUcsQ0FBQyxNQUFXLEVBQUUsR0FBUTt3QkFNdkIsSUFBSSxHQUFHLEtBQUssTUFBTSxFQUFFOzRCQUNsQixPQUFPLElBQUksQ0FBQTt5QkFDWjt3QkFFRCxJQUFJLEdBQUcsS0FBSyxjQUFjLEVBQUU7NEJBQzFCLE9BQU8sTUFBTSxDQUFBO3lCQUNkO3dCQUNELE9BQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUE7b0JBQ2pDLENBQUM7aUJBQ0YsQ0FBQTtnQkFFRCxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRTtvQkFDekIsTUFBTSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFLGtCQUFrQixDQUFDLENBQUE7b0JBQ25ELE1BQU0sQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLGVBQWUsRUFBRTt3QkFDN0MsR0FBRzs0QkFDRCxPQUFPLEtBQUssQ0FBQTt3QkFDZCxDQUFDO3dCQUNELEdBQUcsQ0FBQyxRQUFROzRCQUNWLE9BQU8sUUFBUSxDQUFBO3dCQUNqQixDQUFDO3dCQUNELFVBQVUsRUFBRSxJQUFJO3dCQUNoQixZQUFZLEVBQUUsS0FBSztxQkFDcEIsQ0FBQyxDQUFBO2lCQUNIO1lBQ0gsQ0FBQyxDQUFBO1lBR0QsTUFBTSxvQkFBb0IsR0FBRyxDQUFDLE1BQVcsRUFBRSxPQUFZLEVBQUUsSUFBUyxFQUFFLEVBQUU7Z0JBQ3BFLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFBO2dCQUcxQyxNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUE7Z0JBQ3RCLE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUE7Z0JBSTlCLE1BQU0sQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRTtvQkFDdEMsWUFBWSxFQUFFLElBQUk7b0JBQ2xCLEdBQUcsRUFBRTt3QkFDSCxPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUE7b0JBQ3ZCLENBQUM7b0JBQ0QsR0FBRyxFQUFFLFVBQVUsUUFBUTt3QkFDckIscUJBQXFCLENBQUMsSUFBSSxDQUFDLENBQUE7d0JBRTNCLE1BQU0sQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRTs0QkFDdEMsWUFBWSxFQUFFLEtBQUs7NEJBQ25CLFFBQVEsRUFBRSxLQUFLOzRCQUNmLEtBQUssRUFBRSxPQUFPO3lCQUNmLENBQUMsQ0FBQTt3QkFDRixPQUFPLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQTtvQkFDM0IsQ0FBQztpQkFDRixDQUFDLENBQUE7Z0JBQ0YsT0FBTyxNQUFNLENBQUE7WUFDZixDQUFDLENBQUE7WUFHRCxNQUFNLHdCQUF3QixHQUFHLEdBQUcsRUFBRTtnQkFFcEMsTUFBTSxhQUFhLEdBQUc7b0JBRXBCLEdBQUcsQ0FBQyxNQUFXLEVBQUUsR0FBUTt3QkFDdkIsT0FBTyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQTtvQkFDakMsQ0FBQztvQkFDRCxLQUFLLEVBQUUsVUFBVSxNQUFXLEVBQUUsT0FBWSxFQUFFLElBQVM7d0JBQ25ELE1BQU0sUUFBUSxHQUFHLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsV0FBVyxFQUFFLEtBQUssUUFBUSxDQUFBO3dCQUMvRSxJQUFJLENBQUMsUUFBUSxFQUFFOzRCQUViLE9BQU8sTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUE7eUJBQ25DOzZCQUFNOzRCQUNMLE9BQU8sb0JBQW9CLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQTt5QkFDbkQ7b0JBQ0gsQ0FBQztpQkFDRixDQUFBO2dCQUVELFFBQVEsQ0FBQyxhQUFhLEdBQUcsSUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLGFBQWEsRUFBRSxhQUFhLENBQUMsQ0FBQTtZQUMzRSxDQUFDLENBQUE7WUFHRCx3QkFBd0IsRUFBRSxDQUFBO1NBQzNCO1FBQUMsT0FBTyxHQUFHLEVBQUU7U0FFYjtJQUNILENBQUM7SUFDRCxNQUFNLCtCQUFtQixDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRSxHQUFHLEVBQUUsZUFBSyxDQUFDLENBQUE7QUFDdkQsQ0FBQztBQUVELEtBQUssVUFBVSxZQUFZLENBQUMsSUFBVTtJQUNwQyxTQUFTLEdBQUcsQ0FBQyxLQUFVO1FBV3JCLE1BQU0sVUFBVSxHQUFHLENBQUMsR0FBUSxFQUFFLEVBQUU7WUFDOUIsTUFBTSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsR0FBRyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1lBQzlDLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQTtZQUNmLElBQUksUUFBUSxJQUFJLFFBQVEsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLEVBQUU7Z0JBQzdDLE1BQU0sR0FBRyxRQUFRO3FCQUNkLElBQUksRUFBRTtxQkFDTixPQUFPLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQztxQkFDdkIsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUM7cUJBQ2hCLElBQUksRUFBRTtxQkFDTixLQUFLLENBQUMsR0FBRyxDQUFDO3FCQUNWLE1BQU0sQ0FBQyxDQUFDLENBQU0sRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztxQkFDdkIsR0FBRyxDQUFDLENBQUMsQ0FBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQTthQUM3QjtZQUNELE9BQU87Z0JBQ0wsSUFBSTtnQkFDSixRQUFRO2dCQUNSLE1BQU07YUFDUCxDQUFBO1FBQ0gsQ0FBQyxDQUFBO1FBRUQsTUFBTSxXQUFXLEdBQUc7WUFFbEIsS0FBSyxFQUFFLFVBQVUsTUFBVyxFQUFFLEdBQVEsRUFBRSxJQUFTO2dCQUMvQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtvQkFDekIsT0FBTyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQTtpQkFDL0I7Z0JBQ0QsTUFBTSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7Z0JBRTVDLElBQUksSUFBSSxLQUFLLFdBQVcsRUFBRTtvQkFDeEIsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxFQUFFO3dCQUNsQyxPQUFPLFVBQVUsQ0FBQTtxQkFDbEI7aUJBQ0Y7Z0JBRUQsSUFBSSxJQUFJLEtBQUssYUFBYSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRTtvQkFDNUMsT0FBTyxPQUFPLENBQUE7aUJBQ2Y7Z0JBR0QsSUFBSSxJQUFJLEtBQUssV0FBVyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRTtvQkFDMUMsT0FBTyxVQUFVLENBQUE7aUJBQ2xCO2dCQUVELE9BQU8sTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUE7WUFDaEMsQ0FBQztTQUNGLENBQUE7UUFHRCxLQUFLLENBQUMsZ0JBQWdCLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLGFBQWEsRUFBRSxXQUFXLENBQUMsQ0FBQTtJQUNoRixDQUFDO0lBQ0QsTUFBTSwrQkFBbUIsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUUsR0FBRyxFQUFFLGVBQUssQ0FBQyxDQUFBO0FBQ3ZELENBQUM7QUFFRCxLQUFLLFVBQVUsa0JBQWtCLENBQUMsSUFBVTtJQUMxQyxTQUFTLEdBQUcsQ0FBQyxLQUFVO1FBQ3JCLE1BQU0sQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsRUFBRSxXQUFXLEVBQUU7WUFDbkUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQztTQUMzQixDQUFDLENBQUE7SUFDSixDQUFDO0lBQ0QsTUFBTSwrQkFBbUIsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUUsR0FBRyxFQUFFLGVBQUssQ0FBQyxDQUFBO0FBQ3ZELENBQUM7QUFFRCxLQUFLLFVBQVUscUJBQXFCLENBQUMsSUFBVTtJQUM3QyxTQUFTLEdBQUcsQ0FBQyxLQUFVO1FBQ3JCLE1BQU0sT0FBTyxHQUFHO1lBQ2QsS0FBSyxFQUFFLFVBQVUsTUFBVyxFQUFFLEdBQVEsRUFBRSxJQUFTO2dCQUMvQyxNQUFNLEtBQUssR0FBRyxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtnQkFFN0IsSUFBSSxLQUFLLElBQUksS0FBSyxDQUFDLElBQUksSUFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLGVBQWUsRUFBRTtvQkFDekQsTUFBTSxNQUFNLEdBQUcsRUFBRSxLQUFLLEVBQUUsWUFBWSxDQUFDLFVBQVUsRUFBRSxDQUFBO29CQUNqRCxNQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsQ0FBQTtvQkFDekQsT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBO2lCQUMvQjtnQkFFRCxPQUFPLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFBO1lBQ2hELENBQUM7U0FDRixDQUFBO1FBRUQsS0FBSyxDQUFDLGdCQUFnQixDQUNwQixNQUFNLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQ3RDLE9BQU8sRUFDUCxPQUFPLENBQ1IsQ0FBQTtJQUNILENBQUM7SUFDRCxNQUFNLCtCQUFtQixDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRSxHQUFHLEVBQUUsZUFBSyxDQUFDLENBQUE7QUFDdkQsQ0FBQztBQUVELEtBQUssVUFBVSxlQUFlLENBQUMsSUFBVTtJQUN2QyxTQUFTLEdBQUcsQ0FBQyxLQUFVLEVBQUUsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUEyQjtRQUM3RCxHQUFHLEdBQUcsS0FBSyxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUcvQixNQUFNLFVBQVUsR0FBRyxTQUFTLElBQUksU0FBUyxJQUFJLFNBQVMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFBO1FBQ3JFLElBQUksVUFBVSxFQUFFO1lBQ2QsT0FBTTtTQUNQO1FBRUQsTUFBTSxTQUFTLEdBQUcsR0FBRyxDQUFDLHFCQUFxQixDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUE7UUFDdkUsTUFBTSxPQUFPLEdBQUcsR0FBRyxDQUFDLG1CQUFtQixDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7UUFJakUsS0FBSyxNQUFNLFVBQVUsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ3JDLFVBQVUsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBUyxFQUFFLEtBQVUsRUFBRSxFQUFFO2dCQUN2RCxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQTtnQkFFakQsTUFBTSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksRUFBRTtvQkFDcEQsS0FBSyxFQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUM7b0JBQ3RCLFFBQVEsRUFBRSxLQUFLO29CQUNmLFVBQVUsRUFBRSxLQUFLO29CQUNqQixZQUFZLEVBQUUsSUFBSTtpQkFDbkIsQ0FBQyxDQUFBO2dCQUNGLE1BQU0sQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLGVBQWUsRUFBRTtvQkFDdEQsS0FBSyxFQUFFLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDO29CQUM5QyxRQUFRLEVBQUUsS0FBSztvQkFDZixVQUFVLEVBQUUsS0FBSztvQkFDakIsWUFBWSxFQUFFLElBQUk7aUJBQ25CLENBQUMsQ0FBQTtZQUNKLENBQUMsQ0FBQyxDQUFBO1NBQ0g7UUFFRCxNQUFNLGNBQWMsR0FBRyxDQUFDLElBQVMsRUFBRSxLQUFVLEVBQUUsRUFBRSxDQUMvQyxLQUFLLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLEVBQUUsSUFBSSxFQUFFO1lBQzVELEdBQUc7Z0JBQ0QsT0FBTyxLQUFLLENBQUE7WUFDZCxDQUFDO1NBQ0YsQ0FBQyxDQUFBO1FBRUosY0FBYyxDQUFDLFdBQVcsRUFBRSxTQUFTLENBQUMsQ0FBQTtRQUN0QyxjQUFjLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFBO0lBQ3BDLENBQUM7SUFFRCxJQUFJLGtCQUFrQixHQUFHLENBQUMsS0FBVSxFQUFFLEdBQVEsRUFBRSxFQUFFLENBQ2hELFVBQ0UsU0FBUyxHQUFHLEVBQUUsRUFDZCxLQUFLLEdBQUcsYUFBYSxDQUFDLFNBQVMsRUFDL0IsU0FBUyxHQUFHLFFBQVEsQ0FBQyxTQUFTLEVBQzlCLFlBQVksR0FBRyxNQUFNO1FBR3JCLE1BQU0sVUFBVSxHQUFHLENBQUMsR0FBUSxFQUFFLElBQVMsRUFBRSxLQUFVLEVBQUUsRUFBRSxDQUNyRCxNQUFNLENBQUMsY0FBYyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUU7WUFDL0IsS0FBSztZQUNMLFFBQVEsRUFBRSxLQUFLO1lBQ2YsVUFBVSxFQUFFLEtBQUs7WUFDakIsWUFBWSxFQUFFLElBQUk7U0FDbkIsQ0FBQyxDQUFBO1FBR0osTUFBTSxRQUFRLEdBQUcsQ0FBQyxJQUFTLEVBQUUsRUFBRTtZQUM3QixNQUFNLElBQUksR0FBRyxFQUFFLENBQUE7WUFDZixLQUFLLE1BQU0sSUFBSSxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ3BDLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRTtvQkFDekIsU0FBUTtpQkFDVDtnQkFDRCxVQUFVLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQTthQUNuQztZQUNELE9BQU8sU0FBUyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQTtRQUM5QixDQUFDLENBQUE7UUFFRCxNQUFNLFNBQVMsR0FBRyxDQUFDLElBQVMsRUFBRSxJQUFTLEVBQUUsRUFBRTtZQUN6QyxJQUFJLFVBQVUsR0FBRyxNQUFNLENBQUMseUJBQXlCLENBQUMsSUFBSSxDQUFDLENBQUE7WUFJdkQsSUFBSyxTQUFpQixLQUFNLE1BQU0sQ0FBQyxTQUFpQixFQUFFO2dCQUNwRCxVQUFVLEdBQUc7b0JBQ1gsR0FBRyxVQUFVO29CQUNiLE1BQU0sRUFBRTt3QkFDTixLQUFLLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNO3dCQUM5QixRQUFRLEVBQUUsS0FBSzt3QkFDZixVQUFVLEVBQUUsS0FBSzt3QkFDakIsWUFBWSxFQUFFLElBQUk7cUJBQ25CO2lCQUNGLENBQUE7YUFDRjtZQUdELE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLFVBQVUsQ0FBQyxDQUFBO1lBR2hELE1BQU0sU0FBUyxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLFFBQVEsRUFBRSxlQUFlLENBQUMsQ0FBQTtZQUNuRSxPQUFPLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRTtnQkFDcEIsT0FBTyxDQUFDLE1BQU07b0JBQ1osT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQVEsQ0FBQyxDQUFDLENBQUE7Z0JBQzdFLENBQUM7Z0JBQ0Qsd0JBQXdCLENBQUMsTUFBTSxFQUFFLElBQUk7b0JBQ25DLElBQUksU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFXLENBQUMsRUFBRTt3QkFDbkMsT0FBTyxTQUFTLENBQUE7cUJBQ2pCO29CQUNELE9BQU8sT0FBTyxDQUFDLHdCQUF3QixDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQTtnQkFDdkQsQ0FBQzthQUNGLENBQUMsQ0FBQTtRQUNKLENBQUMsQ0FBQTtRQUVELE1BQU0sVUFBVSxHQUFlLEVBQUUsQ0FBQTtRQUdqQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7WUFDekIsVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQTtRQUNqQyxDQUFDLENBQUMsQ0FBQTtRQUdGLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRTtZQUMzQixVQUFVLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxZQUFZLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQTtRQUNwRCxDQUFDLENBQUMsQ0FBQTtRQUdGLElBQUksRUFBRSxHQUFRO1lBQ1osR0FBRyxNQUFNLENBQUMseUJBQXlCLENBQUMsVUFBVSxDQUFDO1lBTS9DLE1BQU0sRUFBRTtnQkFDTixLQUFLLEVBQUUsVUFBVSxDQUFDLE1BQU07Z0JBQ3hCLFFBQVEsRUFBRSxLQUFLO2dCQUNmLFVBQVUsRUFBRSxLQUFLO2dCQUNqQixZQUFZLEVBQUUsSUFBSTthQUNuQjtTQUNGLENBQUE7UUFDRCxNQUFNLGFBQWEsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQTtRQUc5QyxNQUFNLGFBQWEsR0FBRyxHQUFHLENBQUMscUJBQXFCLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxFQUFFLFlBQVksRUFBRSxVQUFVLENBQUMsQ0FBQTtRQUd2RixNQUFNLGtCQUFrQixHQUFHLElBQUksS0FBSyxDQUFDLGFBQWEsRUFBRTtZQUNsRCxHQUFHLENBQUMsTUFBTSxFQUFFLEdBQUcsR0FBRyxFQUFFO2dCQUVsQixJQUFJLEdBQUcsS0FBSyxNQUFNLEVBQUU7b0JBQ2xCLE9BQU8sYUFBYSxDQUFDLElBQUksQ0FBQTtpQkFDMUI7Z0JBQ0QsSUFBSSxHQUFHLEtBQUssV0FBVyxFQUFFO29CQUN2QixPQUFPLGFBQWEsQ0FBQyxTQUFTLENBQUE7aUJBQy9CO2dCQUNELElBQUssS0FBYSxLQUFNLFdBQVcsQ0FBQyxTQUFpQixJQUFJLEdBQUcsS0FBSyxTQUFTLEVBQUU7b0JBQzFFLE9BQU8sYUFBYSxDQUFDLE9BQU8sQ0FBQTtpQkFDN0I7Z0JBRUQsT0FBTyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQTtZQUM5QyxDQUFDO1lBQ0QsT0FBTyxDQUFDLE1BQU07Z0JBTVosTUFBTSxJQUFJLEdBQWUsRUFBRSxDQUFBO2dCQUMzQixNQUFNLFNBQVMsR0FBRyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQTtnQkFDMUQsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7Z0JBQzlDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQTtnQkFDcEQsT0FBTyxJQUFJLENBQUE7WUFDYixDQUFDO1lBQ0Qsd0JBQXdCLENBQUMsTUFBTSxFQUFFLElBQUk7Z0JBQ25DLElBQUksSUFBSSxLQUFLLFFBQVEsRUFBRTtvQkFDckIsT0FBTyxTQUFTLENBQUE7aUJBQ2pCO2dCQUNELE9BQU8sT0FBTyxDQUFDLHdCQUF3QixDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQTtZQUN2RCxDQUFDO1NBQ0YsQ0FBQyxDQUFBO1FBRUYsT0FBTyxrQkFBa0IsQ0FBQTtJQUMzQixDQUFDLENBQUE7SUFFSCxJQUFJLHFCQUFxQixHQUFHLENBQUMsS0FBVSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEtBQVUsRUFBRSxZQUFpQixFQUFFLFNBQWMsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUU5RixJQUFJLEVBQUUsS0FBSyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFO1lBQ2xDLEtBQUssQ0FBQyxNQUFXLEVBQUUsR0FBUSxFQUFFLElBQVM7Z0JBQ3BDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO29CQUNoQixNQUFNLElBQUksU0FBUyxDQUNqQixnQ0FDRSxLQUFLLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FDMUIsNkNBQTZDLENBQzlDLENBQUE7aUJBQ0Y7Z0JBSUQsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7Z0JBRTlELE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFBO1lBQ3hFLENBQUM7U0FDRixDQUFDO1FBRUYsU0FBUyxFQUFFLEtBQUssQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRTtZQUM1QyxLQUFLLENBQUMsTUFBVyxFQUFFLEdBQVEsRUFBRSxJQUFTO2dCQUNwQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtvQkFDaEIsTUFBTSxJQUFJLFNBQVMsQ0FDakIscUNBQ0UsS0FBSyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQzFCLDZDQUE2QyxDQUM5QyxDQUFBO2lCQUNGO2dCQUNELE9BQU8sU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQU8sRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQTtZQUMxRSxDQUFDO1NBQ0YsQ0FBQztRQUVGLE9BQU8sRUFBRSxLQUFLLENBQUMsT0FBTztZQUNwQixDQUFDLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFO2dCQUMvQixLQUFLLENBQUMsTUFBVyxFQUFFLEdBQVEsRUFBRSxJQUFTO29CQUNwQyxPQUFPLFNBQVMsQ0FBQTtnQkFDbEIsQ0FBQzthQUNGLENBQUM7WUFDSixDQUFDLENBQUMsU0FBUztLQUNkLENBQUMsQ0FBQTtJQUVGLE1BQU0sK0JBQW1CLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFFLEdBQUcsRUFBRSxlQUFLLEVBQUU7UUFFcEQsR0FBRyxFQUFFLGVBQUssQ0FBQyxZQUFZLENBQUM7WUFDdEIscUJBQXFCLEVBQUUsQ0FBQyxLQUFVLEVBQUUsR0FBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDLGFBQWtCLEVBQUUsRUFBRTtnQkFDdEUsT0FBTyxHQUFHLENBQUMsa0JBQWtCLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUN2QyxhQUFhLEVBQ2IsYUFBYSxDQUFDLFNBQVMsRUFDdkIsUUFBUSxDQUFDLFNBQVMsRUFDbEIsTUFBTSxDQUNQLENBQUE7WUFDSCxDQUFDO1lBQ0QsbUJBQW1CLEVBQUUsQ0FBQyxLQUFVLEVBQUUsR0FBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDLFdBQWdCLEVBQUUsRUFBRTtnQkFDbEUsT0FBTyxHQUFHLENBQUMsa0JBQWtCLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUN2QyxXQUFXLEVBQ1gsV0FBVyxDQUFDLFNBQVMsRUFDckIsTUFBTSxDQUFDLFNBQVMsRUFDaEIsTUFBTSxDQUNQLENBQUE7WUFDSCxDQUFDO1lBQ0Qsa0JBQWtCO1lBQ2xCLHFCQUFxQjtTQUN0QixDQUFDO1FBQ0YsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BK0NmLENBQUM7S0FDSixDQUFDLENBQUE7QUFDSixDQUFDO0FBRUQsS0FBSyxVQUFVLGdCQUFnQixDQUFDLElBQVU7SUFDeEMsU0FBUyxHQUFHLENBQUMsS0FBVTtRQUNyQixNQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLEVBQUUsUUFBUSxFQUFFO1lBQ2hFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxhQUFhO1NBQ3pCLENBQUMsQ0FBQTtJQUNKLENBQUM7SUFDRCxNQUFNLCtCQUFtQixDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRSxHQUFHLEVBQUUsZUFBSyxDQUFDLENBQUE7QUFDdkQsQ0FBQztBQUVELEtBQUssVUFBVSxtQkFBbUIsQ0FBQyxJQUFVO0lBQzNDLFNBQVMsR0FBRyxDQUFDLEtBQVU7UUFDckIsT0FBTyxNQUFNLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFNBQVMsQ0FBQTtJQUNuRCxDQUFDO0lBQ0QsTUFBTSwrQkFBbUIsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUUsR0FBRyxFQUFFLGVBQUssQ0FBQyxDQUFBO0FBQ3ZELENBQUM7QUFFRCxLQUFLLFVBQVUsVUFBVSxDQUFDLElBQVU7SUFDbEMsU0FBUyxHQUFHLENBQUMsS0FBVSxJQUFHLENBQUM7SUFDM0IsTUFBTSwrQkFBbUIsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUUsR0FBRyxFQUFFLGVBQUssQ0FBQyxDQUFBO0FBQ3ZELENBQUM7QUFFRCxLQUFLLFVBQVUsWUFBWSxDQUFDLElBQVU7SUFDcEMsU0FBUyxHQUFHLENBQUMsS0FBVTtRQUNyQixNQUFNLHdCQUF3QixHQUFHO1lBQy9CLEtBQUssRUFBRSxVQUFVLE1BQVcsRUFBRSxHQUFRLEVBQUUsSUFBUztnQkFDL0MsTUFBTSxLQUFLLEdBQUcsQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7Z0JBRTdCLElBQUksS0FBSyxLQUFLLEtBQUssRUFBRTtvQkFDbkIsT0FBTyxZQUFZLENBQUE7aUJBQ3BCO2dCQUVELElBQUksS0FBSyxLQUFLLEtBQUssRUFBRTtvQkFDbkIsT0FBTywwQkFBMEIsQ0FBQTtpQkFDbEM7Z0JBQ0QsT0FBTyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQTtZQUNyRCxDQUFDO1NBQ0YsQ0FBQTtRQUVELE1BQU0sUUFBUSxHQUFHLENBQUMsR0FBUSxFQUFFLFFBQWEsRUFBRSxFQUFFO1lBQzNDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLEVBQUUsUUFBUSxFQUFFLHdCQUF3QixDQUFDLENBQUE7UUFDakUsQ0FBQyxDQUFBO1FBRUQsUUFBUSxDQUFDLHFCQUFxQixDQUFDLFNBQVMsRUFBRSxjQUFjLENBQUMsQ0FBQTtRQUN6RCxRQUFRLENBQUMsc0JBQXNCLENBQUMsU0FBUyxFQUFFLGNBQWMsQ0FBQyxDQUFBO0lBQzVELENBQUM7SUFDRCxNQUFNLCtCQUFtQixDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRSxHQUFHLEVBQUUsZUFBSyxDQUFDLENBQUE7QUFDdkQsQ0FBQztBQUVELEtBQUssVUFBVSxzQkFBc0IsQ0FBQyxJQUFVO0lBQzlDLFNBQVMsR0FBRyxDQUFDLEtBQVU7UUFDckIsSUFBSTtZQUNGLElBQUksTUFBTSxDQUFDLFVBQVUsSUFBSSxNQUFNLENBQUMsV0FBVyxFQUFFO2dCQUMzQyxPQUFNO2FBQ1A7WUFDRCxNQUFNLFdBQVcsR0FBRyxFQUFFLENBQUE7WUFDdEIsTUFBTSxDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFBO1lBQ3JDLE1BQU0sQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUE7U0FDdEQ7UUFBQyxPQUFPLEdBQUcsRUFBRSxHQUFFO0lBQ2xCLENBQUM7SUFDRCxNQUFNLCtCQUFtQixDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRSxHQUFHLEVBQUUsZUFBSyxDQUFDLENBQUE7QUFDdkQsQ0FBQyJ9