"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.consoleMessage = void 0;
var chalk_1 = __importDefault(require("chalk"));
var createDirectories_1 = require("./createDirectories");
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var os_1 = __importDefault(require("os"));
var util_1 = __importDefault(require("util"));
exports.consoleMessage = (function () {
    var shouldLogToFile = false;
    var desktopPath = path_1.default.join(os_1.default.homedir(), "Desktop");
    var logPath = function () { return createDirectories_1.createDirectories(path_1.default.join(desktopPath, "logs/logs.txt")); };
    var titlify = function (title) {
        if (typeof title === "object") {
            return title.title.padEnd(title.padding, " ");
        }
        else {
            return "[" + title + "]";
        }
    };
    var logToFile = function (title, content) {
        if (!shouldLogToFile)
            return;
        fs_1.default.appendFileSync(logPath(), util_1.default.format("[" + title + "] " + content) + "\n");
    };
    var error = function (title) {
        var s = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            s[_i - 1] = arguments[_i];
        }
        logToFile(title, s.join(" "));
        return console.log.apply(console, __spread([chalk_1.default.bgRed.green(titlify(title))], s));
    };
    var info = function (title) {
        var s = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            s[_i - 1] = arguments[_i];
        }
        logToFile(title, s.join(" "));
        console.log.apply(console, __spread([chalk_1.default.bgBlue.white(titlify(title))], s));
    };
    var warning = function (title) {
        var s = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            s[_i - 1] = arguments[_i];
        }
        logToFile(title, s.join(" "));
        console.log.apply(console, __spread([chalk_1.default.bgYellow.red(titlify(title))], s));
    };
    var success = function (title) {
        var s = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            s[_i - 1] = arguments[_i];
        }
        logToFile(title, s.join(" "));
        console.log.apply(console, __spread([chalk_1.default.bgGreen.red(titlify(title))], s));
    };
    return {
        desktopPath: desktopPath,
        logToFile: logToFile,
        error: error,
        info: info,
        warning: warning,
        success: success,
        setLogPath: function (value) {
            logPath = function () { return value; };
        },
        setShouldLogToFile: function (value) {
            if (value === void 0) { value = false; }
            shouldLogToFile = value;
        }
    };
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc29sZU1lc3NhZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvY29uc29sZU1lc3NhZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxnREFBeUI7QUFDekIseURBQXVEO0FBQ3ZELDhDQUF1QjtBQUN2QiwwQ0FBbUI7QUFDbkIsMENBQW1CO0FBQ25CLDhDQUF1QjtBQUVWLFFBQUEsY0FBYyxHQUFHLENBQUM7SUFDN0IsSUFBSSxlQUFlLEdBQUcsS0FBSyxDQUFBO0lBQzNCLElBQUksV0FBVyxHQUFHLGNBQUksQ0FBQyxJQUFJLENBQUMsWUFBRSxDQUFDLE9BQU8sRUFBRSxFQUFFLFNBQVMsQ0FBQyxDQUFBO0lBQ3BELElBQUksT0FBTyxHQUFHLGNBQU0sT0FBQSxxQ0FBaUIsQ0FBQyxjQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxlQUFlLENBQUMsQ0FBQyxFQUExRCxDQUEwRCxDQUFBO0lBRTlFLElBQU0sT0FBTyxHQUFHLFVBQUMsS0FBa0Q7UUFDakUsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLEVBQUU7WUFDN0IsT0FBTyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFBO1NBQzlDO2FBQU07WUFDTCxPQUFPLE1BQUksS0FBSyxNQUFHLENBQUE7U0FDcEI7SUFDSCxDQUFDLENBQUE7SUFFRCxJQUFNLFNBQVMsR0FBRyxVQUFDLEtBQWEsRUFBRSxPQUFZO1FBQzVDLElBQUksQ0FBQyxlQUFlO1lBQUUsT0FBTTtRQUM1QixZQUFFLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxFQUFFLGNBQUksQ0FBQyxNQUFNLENBQUMsTUFBSSxLQUFLLE9BQUksR0FBRyxPQUFPLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQTtJQUMzRSxDQUFDLENBQUE7SUFFRCxJQUFNLEtBQUssR0FBRyxVQUFDLEtBQWE7UUFBRSxXQUFTO2FBQVQsVUFBUyxFQUFULHFCQUFTLEVBQVQsSUFBUztZQUFULDBCQUFTOztRQUNyQyxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTtRQUM3QixPQUFPLE9BQU8sQ0FBQyxHQUFHLE9BQVgsT0FBTyxZQUFLLGVBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFLLENBQUMsR0FBQztJQUM3RCxDQUFDLENBQUE7SUFDRCxJQUFNLElBQUksR0FBRyxVQUFDLEtBQWE7UUFBRSxXQUFTO2FBQVQsVUFBUyxFQUFULHFCQUFTLEVBQVQsSUFBUztZQUFULDBCQUFTOztRQUNwQyxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTtRQUM3QixPQUFPLENBQUMsR0FBRyxPQUFYLE9BQU8sWUFBSyxlQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBSyxDQUFDLEdBQUM7SUFDdkQsQ0FBQyxDQUFBO0lBQ0QsSUFBTSxPQUFPLEdBQUcsVUFBQyxLQUFhO1FBQUUsV0FBUzthQUFULFVBQVMsRUFBVCxxQkFBUyxFQUFULElBQVM7WUFBVCwwQkFBUzs7UUFDdkMsU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7UUFDN0IsT0FBTyxDQUFDLEdBQUcsT0FBWCxPQUFPLFlBQUssZUFBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUssQ0FBQyxHQUFDO0lBQ3ZELENBQUMsQ0FBQTtJQUVELElBQU0sT0FBTyxHQUFHLFVBQUMsS0FBYTtRQUFFLFdBQVM7YUFBVCxVQUFTLEVBQVQscUJBQVMsRUFBVCxJQUFTO1lBQVQsMEJBQVM7O1FBQ3ZDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFBO1FBQzdCLE9BQU8sQ0FBQyxHQUFHLE9BQVgsT0FBTyxZQUFLLGVBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFLLENBQUMsR0FBQztJQUN0RCxDQUFDLENBQUE7SUFFRCxPQUFPO1FBQ0wsV0FBVyxhQUFBO1FBQ1gsU0FBUyxXQUFBO1FBQ1QsS0FBSyxPQUFBO1FBQ0wsSUFBSSxNQUFBO1FBQ0osT0FBTyxTQUFBO1FBQ1AsT0FBTyxTQUFBO1FBQ1AsVUFBVSxFQUFFLFVBQUMsS0FBYTtZQUN4QixPQUFPLEdBQUcsY0FBTSxPQUFBLEtBQUssRUFBTCxDQUFLLENBQUE7UUFDdkIsQ0FBQztRQUNELGtCQUFrQixFQUFFLFVBQUMsS0FBc0I7WUFBdEIsc0JBQUEsRUFBQSxhQUFzQjtZQUN6QyxlQUFlLEdBQUcsS0FBSyxDQUFBO1FBQ3pCLENBQUM7S0FDRixDQUFBO0FBQ0gsQ0FBQyxDQUFDLEVBQUUsQ0FBQSJ9