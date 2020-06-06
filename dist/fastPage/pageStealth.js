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
                NOT_INSTALLED: "not_installed",
            },
            RunningState: {
                CANNOT_RUN: "cannot_run",
                READY_TO_RUN: "ready_to_run",
                RUNNING: "running",
            },
        },
        csi() { },
        loadTimes() { },
        webstore: {
            onInstallStageChanged: {},
            onDownloadProgress: {},
            install(url, onSuccess, onFailure) {
                installer.install(url, onSuccess, onFailure);
            },
        },
        runtime: {
            OnInstalledReason: {
                CHROME_UPDATE: "chrome_update",
                INSTALL: "install",
                SHARED_MODULE_UPDATE: "shared_module_update",
                UPDATE: "update",
            },
            OnRestartRequiredReason: {
                APP_UPDATE: "app_update",
                OS_UPDATE: "os_update",
                PERIODIC: "periodic",
            },
            PlatformArch: {
                ARM: "arm",
                MIPS: "mips",
                MIPS64: "mips64",
                X86_32: "x86-32",
                X86_64: "x86-64",
            },
            PlatformNaclArch: {
                ARM: "arm",
                MIPS: "mips",
                MIPS64: "mips64",
                X86_32: "x86-32",
                X86_64: "x86-64",
            },
            PlatformOs: {
                ANDROID: "android",
                CROS: "cros",
                LINUX: "linux",
                MAC: "mac",
                OPENBSD: "openbsd",
                WIN: "win",
            },
            RequestUpdateCheckStatus: {
                NO_UPDATE: "no_update",
                THROTTLED: "throttled",
                UPDATE_AVAILABLE: "update_available",
            },
            connect: function () { }.bind(function () { }),
            sendMessage: function () { }.bind(function () { }),
        },
    };
};
async function runtimeStealth(page) {
    await page.addInitScript((args) => {
        if (args && args.fns) {
            for (const fn of Object.keys(args.fns)) {
                eval(`var ${fn} =  ${args.fns[fn]}`);
            }
        }
        ;
        window.chrome = getChromeRuntimeMock(window);
    }, {
        fns: {
            getChromeRuntimeMock: `${getChromeRuntimeMock.toString()}`,
        },
    });
}
async function consoleDebug(page) {
    await page.addInitScript(() => {
        window.console.debug = () => {
            return null;
        };
    });
}
async function navigatorLanguages(page) {
    await page.addInitScript(() => {
        Object.defineProperty(navigator, "languages", {
            get: () => ["en-US", "en"],
        });
    });
}
async function navigatorPermissions(page) {
    await page.addInitScript(() => {
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
    await page.addInitScript(() => {
        let batteryObj = {
            charging: true,
            chargingTime: 0,
            dischargingTime: Infinity,
            level: 1,
            onchargingchange: null,
            onchargingtimechange: null,
            ondischargingtimechange: null,
            onlevelchange: null,
        };
        for (let vv of ["battery", "getBattery"]) {
            Object.defineProperty(navigator, vv, {
                get: () => {
                    return Promise.resolve(batteryObj);
                },
            });
            Object.defineProperty(Navigator, vv, {
                get: () => {
                    return Promise.resolve(batteryObj);
                },
            });
        }
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
                        __pluginName: "Chrome PDF Viewer",
                    },
                    {
                        type: "application/x-google-chrome-pdf",
                        suffixes: "pdf",
                        description: "Portable Document Format",
                        __pluginName: "Chrome PDF Plugin",
                    },
                    {
                        type: "application/x-nacl",
                        suffixes: "",
                        description: "Native Client Executable",
                        enabledPlugin: Plugin,
                        __pluginName: "Native Client",
                    },
                    {
                        type: "application/x-pnacl",
                        suffixes: "",
                        description: "Portable Native Client Executable",
                        __pluginName: "Native Client",
                    },
                ],
                plugins: [
                    {
                        name: "Chrome PDF Plugin",
                        filename: "internal-pdf-viewer",
                        description: "Portable Document Format",
                    },
                    {
                        name: "Chrome PDF Viewer",
                        filename: "mhjfbmdgcfjbbpaeojofohoefgiehjai",
                        description: "",
                    },
                    {
                        name: "Native Client",
                        filename: "internal-nacl-plugin",
                        description: "",
                    },
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
                    },
                },
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
                get: () => mimeTypeArray,
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
                get: () => pluginArray,
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
    await page.addInitScript(() => {
        Object.defineProperty(window, "navigator", {
            value: new Proxy(navigator, {
                has: (target, key) => (key === "webdriver" ? false : key in target),
                get: (target, key, receiver) => (key === "webdriver" ? undefined : target[key]),
            }),
        });
    });
}
async function navigorVendor(page) {
    await page.addInitScript((v) => {
        Object.defineProperty(navigator, "vendor", {
            get: () => v,
        });
    }, "Google Inc.");
}
async function webGlVendor(page) {
    await page.addInitScript(() => {
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
                },
            };
            const proxy = new Proxy(WebGLRenderingContext.prototype.getParameter, getParameterProxyHandler);
            Object.defineProperty(WebGLRenderingContext.prototype, "getParameter", {
                configurable: true,
                enumerable: false,
                writable: false,
                value: proxy,
            });
        }
        catch (err) {
            console.warn(err);
        }
    });
}
async function outerWindow(page) {
    await page.addInitScript(() => {
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
    await page.addInitScript(() => {
        window.console.debug = () => {
            return null;
        };
    });
}
async function iframeStealth(page) {
    await page.addInitScript(() => {
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
    });
}
async function mediaCodecStealth(page) {
    await page.addInitScript(() => {
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
                },
            };
            HTMLMediaElement.prototype.canPlayType = new Proxy(HTMLMediaElement.prototype.canPlayType, canPlayType);
        }
        catch (err) { }
    });
}
async function pageStealth(page) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnZVN0ZWFsdGguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZmFzdFBhZ2UvcGFnZVN0ZWFsdGgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxNQUFNLG9CQUFvQixHQUFHLENBQUMsTUFBVyxFQUFFLEVBQUU7SUFDM0MsTUFBTSxTQUFTLEdBQVEsRUFBRSxPQUFPLEtBQUksQ0FBQyxFQUFFLENBQUE7SUFDdkMsT0FBTztRQUNMLEdBQUcsRUFBRTtZQUNILFdBQVcsRUFBRSxLQUFLO1lBQ2xCLFlBQVksRUFBRTtnQkFDWixRQUFRLEVBQUUsVUFBVTtnQkFDcEIsU0FBUyxFQUFFLFdBQVc7Z0JBQ3RCLGFBQWEsRUFBRSxlQUFlO2FBQy9CO1lBQ0QsWUFBWSxFQUFFO2dCQUNaLFVBQVUsRUFBRSxZQUFZO2dCQUN4QixZQUFZLEVBQUUsY0FBYztnQkFDNUIsT0FBTyxFQUFFLFNBQVM7YUFDbkI7U0FDRjtRQUNELEdBQUcsS0FBSSxDQUFDO1FBQ1IsU0FBUyxLQUFJLENBQUM7UUFDZCxRQUFRLEVBQUU7WUFDUixxQkFBcUIsRUFBRSxFQUFFO1lBQ3pCLGtCQUFrQixFQUFFLEVBQUU7WUFDdEIsT0FBTyxDQUFDLEdBQVEsRUFBRSxTQUFjLEVBQUUsU0FBYztnQkFDOUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFBO1lBQzlDLENBQUM7U0FDRjtRQUNELE9BQU8sRUFBRTtZQUNQLGlCQUFpQixFQUFFO2dCQUNqQixhQUFhLEVBQUUsZUFBZTtnQkFDOUIsT0FBTyxFQUFFLFNBQVM7Z0JBQ2xCLG9CQUFvQixFQUFFLHNCQUFzQjtnQkFDNUMsTUFBTSxFQUFFLFFBQVE7YUFDakI7WUFDRCx1QkFBdUIsRUFBRTtnQkFDdkIsVUFBVSxFQUFFLFlBQVk7Z0JBQ3hCLFNBQVMsRUFBRSxXQUFXO2dCQUN0QixRQUFRLEVBQUUsVUFBVTthQUNyQjtZQUNELFlBQVksRUFBRTtnQkFD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