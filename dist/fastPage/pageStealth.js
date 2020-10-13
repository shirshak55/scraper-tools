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
    }
    await withUtils_1.withUtilsInitScript(page.context(), fun, utils_1.default.patchToString(window.chrome.loadTimes));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnZVN0ZWFsdGguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZmFzdFBhZ2UvcGFnZVN0ZWFsdGgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFHQSwyQ0FBaUQ7QUFDakQsb0RBQTJCO0FBSVosS0FBSyxVQUFVLFdBQVcsQ0FBQyxJQUFVO0lBQ2xELE1BQU0sVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQ3RCLE1BQU0sVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQ3RCLE1BQU0sZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDNUIsTUFBTSxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDMUIsTUFBTSxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUNoQyxNQUFNLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUN4QixNQUFNLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFBO0lBQzlCLE1BQU0scUJBQXFCLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDakMsTUFBTSxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDM0IsTUFBTSxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUM1QixNQUFNLG1CQUFtQixDQUFDLElBQUksQ0FBQyxDQUFBO0lBQy9CLE1BQU0sVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFBO0lBSXRCLE1BQU0sWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQ3hCLE1BQU0sc0JBQXNCLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDcEMsQ0FBQztBQWxCRCw4QkFrQkM7QUFFRCxLQUFLLFVBQVUsVUFBVSxDQUFDLElBQVU7SUFDbEMsTUFBTSwrQkFBbUIsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUUsR0FBRyxFQUFFO1FBQzdDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFO1lBR2xCLE1BQU0sQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRTtnQkFD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