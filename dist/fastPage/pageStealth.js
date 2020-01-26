"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getChromeRuntimeMock = (window) => {
    const installer = { install() { } };
    return {
        app: {
            isInstalled: false,
            InstallState: {
                DISABLED: "disabled",
                INSTALLED: "installed",
                NOT_INSTALLED: "not_installed"
            },
            RunningState: {
                CANNOT_RUN: "cannot_run",
                READY_TO_RUN: "ready_to_run",
                RUNNING: "running"
            }
        },
        csi() { },
        loadTimes() { },
        webstore: {
            onInstallStageChanged: {},
            onDownloadProgress: {},
            install(url, onSuccess, onFailure) {
                installer.install(url, onSuccess, onFailure);
            }
        },
        runtime: {
            OnInstalledReason: {
                CHROME_UPDATE: "chrome_update",
                INSTALL: "install",
                SHARED_MODULE_UPDATE: "shared_module_update",
                UPDATE: "update"
            },
            OnRestartRequiredReason: {
                APP_UPDATE: "app_update",
                OS_UPDATE: "os_update",
                PERIODIC: "periodic"
            },
            PlatformArch: {
                ARM: "arm",
                MIPS: "mips",
                MIPS64: "mips64",
                X86_32: "x86-32",
                X86_64: "x86-64"
            },
            PlatformNaclArch: {
                ARM: "arm",
                MIPS: "mips",
                MIPS64: "mips64",
                X86_32: "x86-32",
                X86_64: "x86-64"
            },
            PlatformOs: {
                ANDROID: "android",
                CROS: "cros",
                LINUX: "linux",
                MAC: "mac",
                OPENBSD: "openbsd",
                WIN: "win"
            },
            RequestUpdateCheckStatus: {
                NO_UPDATE: "no_update",
                THROTTLED: "throttled",
                UPDATE_AVAILABLE: "update_available"
            },
            connect: function () { }.bind(function () { }),
            sendMessage: function () { }.bind(function () { })
        }
    };
};
async function runtimeStealth(page) {
    await page.evaluateOnNewDocument((args) => {
        if (args && args.fns) {
            for (const fn of Object.keys(args.fns)) {
                eval(`var ${fn} =  ${args.fns[fn]}`);
            }
        }
        ;
        window.chrome = getChromeRuntimeMock(window);
    }, {
        fns: {
            getChromeRuntimeMock: `${getChromeRuntimeMock.toString()}`
        }
    });
}
async function consoleDebug(page) {
    await page.evaluateOnNewDocument(() => {
        window.console.debug = () => {
            return null;
        };
    });
}
async function navigatorLanguages(page) {
    await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, "languages", {
            get: () => ["en-US", "en"]
        });
    });
}
async function navigatorPermissions(page) {
    await page.evaluateOnNewDocument(() => {
        const originalQuery = window.navigator.permissions.query;
        window.navigator.permissions.__proto__.query = (parameters) => parameters.name === "notifications"
            ? Promise.resolve({ state: Notification.permission })
            : originalQuery(parameters);
        const oldCall = Function.prototype.call;
        function call() {
            return oldCall.apply(this, arguments);
        }
        Function.prototype.call = call;
        const nativeToStringFunctionString = Error.toString().replace(/Error/g, "toString");
        const oldToString = Function.prototype.toString;
        function functionToString() {
            if (this === window.navigator.permissions.query) {
                return "function query() { [native code] }";
            }
            if (this === functionToString) {
                return nativeToStringFunctionString;
            }
            return oldCall.call(oldToString, this);
        }
        Function.prototype.toString = functionToString;
    });
}
async function navigatorPlugin(page) {
    await page.evaluateOnNewDocument(() => {
        function mockPluginsAndMimeTypes() {
            const makeFnsNative = (fns = []) => {
                const oldCall = Function.prototype.call;
                function call() {
                    return oldCall.apply(this, arguments);
                }
                Function.prototype.call = call;
                const nativeToStringFunctionString = Error.toString().replace(/Error/g, "toString");
                const oldToString = Function.prototype.toString;
                function functionToString() {
                    for (const fn of fns) {
                        if (this === fn.ref) {
                            return `function ${fn.name}() { [native code] }`;
                        }
                    }
                    if (this === functionToString) {
                        return nativeToStringFunctionString;
                    }
                    return oldCall.call(oldToString, this);
                }
                Function.prototype.toString = functionToString;
            };
            const mockedFns = [];
            const fakeData = {
                mimeTypes: [
                    {
                        type: "application/pdf",
                        suffixes: "pdf",
                        description: "",
                        __pluginName: "Chrome PDF Viewer"
                    },
                    {
                        type: "application/x-google-chrome-pdf",
                        suffixes: "pdf",
                        description: "Portable Document Format",
                        __pluginName: "Chrome PDF Plugin"
                    },
                    {
                        type: "application/x-nacl",
                        suffixes: "",
                        description: "Native Client Executable",
                        enabledPlugin: Plugin,
                        __pluginName: "Native Client"
                    },
                    {
                        type: "application/x-pnacl",
                        suffixes: "",
                        description: "Portable Native Client Executable",
                        __pluginName: "Native Client"
                    }
                ],
                plugins: [
                    {
                        name: "Chrome PDF Plugin",
                        filename: "internal-pdf-viewer",
                        description: "Portable Document Format"
                    },
                    {
                        name: "Chrome PDF Viewer",
                        filename: "mhjfbmdgcfjbbpaeojofohoefgiehjai",
                        description: ""
                    },
                    {
                        name: "Native Client",
                        filename: "internal-nacl-plugin",
                        description: ""
                    }
                ],
                fns: {
                    namedItem: (instanceName) => {
                        const fn = function (name) {
                            if (!arguments.length) {
                                throw new TypeError(`Failed to execute 'namedItem' on '${instanceName}': 1 argument required, but only 0 present.`);
                            }
                            return this[name] || null;
                        };
                        mockedFns.push({ ref: fn, name: "namedItem" });
                        return fn;
                    },
                    item: (instanceName) => {
                        const fn = function (index) {
                            if (!arguments.length) {
                                throw new TypeError(`Failed to execute 'namedItem' on '${instanceName}': 1 argument required, but only 0 present.`);
                            }
                            return this[index] || null;
                        };
                        mockedFns.push({ ref: fn, name: "item" });
                        return fn;
                    },
                    refresh: (instanceName) => {
                        const fn = function () {
                            return undefined;
                        };
                        mockedFns.push({ ref: fn, name: "refresh" });
                        return fn;
                    }
                }
            };
            const getSubset = (keys, obj) => keys.reduce((a, c) => ({ ...a, [c]: obj[c] }), {});
            function generateMimeTypeArray() {
                const arr = fakeData.mimeTypes
                    .map((obj) => getSubset(["type", "suffixes", "description"], obj))
                    .map((obj) => Object.setPrototypeOf(obj, MimeType.prototype));
                arr.forEach((obj) => {
                    arr[obj.type] = obj;
                });
                arr.namedItem = fakeData.fns.namedItem("MimeTypeArray");
                arr.item = fakeData.fns.item("MimeTypeArray");
                return Object.setPrototypeOf(arr, MimeTypeArray.prototype);
            }
            const mimeTypeArray = generateMimeTypeArray();
            Object.defineProperty(navigator, "mimeTypes", {
                get: () => mimeTypeArray
            });
            function generatePluginArray() {
                const arr = fakeData.plugins
                    .map((obj) => getSubset(["name", "filename", "description"], obj))
                    .map((obj) => {
                    const mimes = fakeData.mimeTypes.filter((m) => m.__pluginName === obj.name);
                    mimes.forEach((mime, index) => {
                        ;
                        navigator.mimeTypes[mime.type].enabledPlugin = obj;
                        obj[mime.type] = navigator.mimeTypes[mime.type];
                        obj[index] = navigator.mimeTypes[mime.type];
                    });
                    obj.length = mimes.length;
                    return obj;
                })
                    .map((obj) => {
                    obj.namedItem = fakeData.fns.namedItem("Plugin");
                    obj.item = fakeData.fns.item("Plugin");
                    return obj;
                })
                    .map((obj) => Object.setPrototypeOf(obj, Plugin.prototype));
                arr.forEach((obj) => {
                    arr[obj.name] = obj;
                });
                arr.namedItem = fakeData.fns.namedItem("PluginArray");
                arr.item = fakeData.fns.item("PluginArray");
                arr.refresh = fakeData.fns.refresh("PluginArray");
                return Object.setPrototypeOf(arr, PluginArray.prototype);
            }
            const pluginArray = generatePluginArray();
            Object.defineProperty(navigator, "plugins", {
                get: () => pluginArray
            });
            makeFnsNative(mockedFns);
        }
        try {
            const isPluginArray = navigator.plugins instanceof PluginArray;
            const hasPlugins = isPluginArray && navigator.plugins.length > 0;
            if (isPluginArray && hasPlugins) {
                return;
            }
            mockPluginsAndMimeTypes();
        }
        catch (err) { }
    });
}
async function navigatorWebDriver(page) {
    await page.evaluateOnNewDocument(() => {
        Object.defineProperty(window, "navigator", {
            value: new Proxy(navigator, {
                has: (target, key) => (key === "webdriver" ? false : key in target),
                get: (target, key, receiver) => (key === "webdriver" ? undefined : target[key])
            })
        });
    });
}
async function navigorVendor(page) {
    await page.evaluateOnNewDocument((v) => {
        Object.defineProperty(navigator, "vendor", {
            get: () => v
        });
    }, "Google Inc.");
}
async function webGlVendor(page) {
    await page.evaluateOnNewDocument(() => {
        try {
            var stripErrorStack = (stack) => stack
                .split("\n")
                .filter((line) => !line.includes(`at Object.apply`))
                .filter((line) => !line.includes(`at Object.get`))
                .join("\n");
            const getParameterProxyHandler = {
                get(target, key) {
                    if (key === "toString") {
                        const dummyFn = function toString() {
                            return target.toString();
                        }.bind(Function.prototype.toString);
                        return dummyFn;
                    }
                    try {
                        return Reflect.get(target, key);
                    }
                    catch (err) {
                        err.stack = stripErrorStack(err.stack);
                        throw err;
                    }
                },
                apply: function (target, thisArg, args) {
                    const param = (args || [])[0];
                    if (param === 37445) {
                        return "Intel Inc.";
                    }
                    if (param === 37446) {
                        return "Intel Iris OpenGL Engine";
                    }
                    try {
                        return Reflect.apply(target, thisArg, args);
                    }
                    catch (err) {
                        err.stack = stripErrorStack(err.stack);
                        throw err;
                    }
                }
            };
            const proxy = new Proxy(WebGLRenderingContext.prototype.getParameter, getParameterProxyHandler);
            Object.defineProperty(WebGLRenderingContext.prototype, "getParameter", {
                configurable: true,
                enumerable: false,
                writable: false,
                value: proxy
            });
        }
        catch (err) {
            console.warn(err);
        }
    });
}
async function outerWindow(page) {
    await page.evaluateOnNewDocument(() => {
        try {
            if (window.outerWidth && window.outerHeight) {
                return;
            }
            const windowFrame = 85;
            window.outerWidth = window.innerWidth;
            window.outerHeight = window.innerHeight + windowFrame;
        }
        catch (err) { }
    });
}
async function conssoleDebugStealth(page) {
    await page.evaluateOnNewDocument(() => {
        window.console.debug = () => {
            return null;
        };
    });
}
async function iframeStealth(page) {
    await page.evaluateOnNewDocument(() => {
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
                    }
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
                        configurable: false
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
                            value: _srcdoc
                        });
                        _iframe.srcdoc = newValue;
                    }
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
                    }
                };
                document.createElement = new Proxy(document.createElement, createElement);
            };
            addIframeCreationSniffer();
        }
        catch (err) {
        }
    });
}
async function mediaCodecStealth(page) {
    await page.evaluateOnNewDocument(() => {
        try {
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
                return { mime, codecStr, codecs };
            };
            const canPlayType = {
                get(target, key) {
                    return Reflect.get(target, key);
                },
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
                }
            };
            HTMLMediaElement.prototype.canPlayType = new Proxy(HTMLMediaElement.prototype.canPlayType, canPlayType);
        }
        catch (err) { }
    });
}
async function pageStealth(page) {
    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36");
    await runtimeStealth(page);
    await consoleDebug(page);
    await navigatorLanguages(page);
    await navigatorPermissions(page);
    await navigatorWebDriver(page);
    await navigorVendor(page);
    await webGlVendor(page);
    await navigatorPlugin(page);
    await conssoleDebugStealth(page);
    await iframeStealth(page);
    await mediaCodecStealth(page);
    await outerWindow(page);
}
exports.default = pageStealth;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnZVN0ZWFsdGguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZmFzdFBhZ2UvcGFnZVN0ZWFsdGgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxNQUFNLG9CQUFvQixHQUFHLENBQUMsTUFBVyxFQUFFLEVBQUU7SUFDM0MsTUFBTSxTQUFTLEdBQVEsRUFBRSxPQUFPLEtBQUksQ0FBQyxFQUFFLENBQUE7SUFDdkMsT0FBTztRQUNMLEdBQUcsRUFBRTtZQUNILFdBQVcsRUFBRSxLQUFLO1lBQ2xCLFlBQVksRUFBRTtnQkFDWixRQUFRLEVBQUUsVUFBVTtnQkFDcEIsU0FBUyxFQUFFLFdBQVc7Z0JBQ3RCLGFBQWEsRUFBRSxlQUFlO2FBQy9CO1lBQ0QsWUFBWSxFQUFFO2dCQUNaLFVBQVUsRUFBRSxZQUFZO2dCQUN4QixZQUFZLEVBQUUsY0FBYztnQkFDNUIsT0FBTyxFQUFFLFNBQVM7YUFDbkI7U0FDRjtRQUNELEdBQUcsS0FBSSxDQUFDO1FBQ1IsU0FBUyxLQUFJLENBQUM7UUFDZCxRQUFRLEVBQUU7WUFDUixxQkFBcUIsRUFBRSxFQUFFO1lBQ3pCLGtCQUFrQixFQUFFLEVBQUU7WUFDdEIsT0FBTyxDQUFDLEdBQVEsRUFBRSxTQUFjLEVBQUUsU0FBYztnQkFDOUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFBO1lBQzlDLENBQUM7U0FDRjtRQUNELE9BQU8sRUFBRTtZQUNQLGlCQUFpQixFQUFFO2dCQUNqQixhQUFhLEVBQUUsZUFBZTtnQkFDOUIsT0FBTyxFQUFFLFNBQVM7Z0JBQ2xCLG9CQUFvQixFQUFFLHNCQUFzQjtnQkFDNUMsTUFBTSxFQUFFLFFBQVE7YUFDakI7WUFDRCx1QkFBdUIsRUFBRTtnQkFDdkIsVUFBVSxFQUFFLFlBQVk7Z0JBQ3hCLFNBQVMsRUFBRSxXQUFXO2dCQUN0QixRQUFRLEVBQUUsVUFBVTthQUNyQjtZQUNELFlBQVksRUFBRTtnQkFD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