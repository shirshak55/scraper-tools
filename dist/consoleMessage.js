"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const createDirectories_1 = require("./createDirectories");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const os_1 = __importDefault(require("os"));
const util_1 = __importDefault(require("util"));
exports.consoleMessage = (() => {
    let shouldLogToFile = false;
    let desktopPath = path_1.default.join(os_1.default.homedir(), "Desktop");
    let logPath = () => createDirectories_1.createDirectories(path_1.default.join(desktopPath, "logs/logs.txt"));
    const titlify = (title) => {
        if (typeof title === "object") {
            return title.title.padEnd(title.padding, " ");
        }
        else {
            return `[${title}]`;
        }
    };
    const logToFile = (title, content) => {
        if (!shouldLogToFile)
            return;
        fs_1.default.appendFileSync(logPath(), util_1.default.format(`[${title}] ` + content) + "\n");
    };
    const error = (title, ...s) => {
        logToFile(title, s.join(" "));
        return console.log(chalk_1.default.bgRed.green(titlify(title)), ...s);
    };
    const info = (title, ...s) => {
        logToFile(title, s.join(" "));
        console.log(chalk_1.default.bgBlue.white(titlify(title)), ...s);
    };
    const warning = (title, ...s) => {
        logToFile(title, s.join(" "));
        console.log(chalk_1.default.bgYellow.red(titlify(title)), ...s);
    };
    const success = (title, ...s) => {
        logToFile(title, s.join(" "));
        console.log(chalk_1.default.bgGreen.red(titlify(title)), ...s);
    };
    return {
        desktopPath,
        logToFile,
        error,
        info,
        warning,
        success,
        setLogPath: (value) => {
            logPath = () => value;
        },
        setShouldLogToFile: (value = false) => {
            shouldLogToFile = value;
        }
    };
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc29sZU1lc3NhZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvY29uc29sZU1lc3NhZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxrREFBeUI7QUFDekIsMkRBQXVEO0FBQ3ZELGdEQUF1QjtBQUN2Qiw0Q0FBbUI7QUFDbkIsNENBQW1CO0FBQ25CLGdEQUF1QjtBQUVWLFFBQUEsY0FBYyxHQUFHLENBQUMsR0FBRyxFQUFFO0lBQ2xDLElBQUksZUFBZSxHQUFHLEtBQUssQ0FBQTtJQUMzQixJQUFJLFdBQVcsR0FBRyxjQUFJLENBQUMsSUFBSSxDQUFDLFlBQUUsQ0FBQyxPQUFPLEVBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQTtJQUNwRCxJQUFJLE9BQU8sR0FBRyxHQUFHLEVBQUUsQ0FBQyxxQ0FBaUIsQ0FBQyxjQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxlQUFlLENBQUMsQ0FBQyxDQUFBO0lBRTlFLE1BQU0sT0FBTyxHQUFHLENBQUMsS0FBa0QsRUFBRSxFQUFFO1FBQ3JFLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxFQUFFO1lBQzdCLE9BQU8sS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQTtTQUM5QzthQUFNO1lBQ0wsT0FBTyxJQUFJLEtBQUssR0FBRyxDQUFBO1NBQ3BCO0lBQ0gsQ0FBQyxDQUFBO0lBRUQsTUFBTSxTQUFTLEdBQUcsQ0FBQyxLQUFhLEVBQUUsT0FBWSxFQUFFLEVBQUU7UUFDaEQsSUFBSSxDQUFDLGVBQWU7WUFBRSxPQUFNO1FBQzVCLFlBQUUsQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLEVBQUUsY0FBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssSUFBSSxHQUFHLE9BQU8sQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFBO0lBQzNFLENBQUMsQ0FBQTtJQUVELE1BQU0sS0FBSyxHQUFHLENBQUMsS0FBYSxFQUFFLEdBQUcsQ0FBTSxFQUFFLEVBQUU7UUFDekMsU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7UUFDN0IsT0FBTyxPQUFPLENBQUMsR0FBRyxDQUFDLGVBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUE7SUFDN0QsQ0FBQyxDQUFBO0lBQ0QsTUFBTSxJQUFJLEdBQUcsQ0FBQyxLQUFhLEVBQUUsR0FBRyxDQUFNLEVBQUUsRUFBRTtRQUN4QyxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTtRQUM3QixPQUFPLENBQUMsR0FBRyxDQUFDLGVBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUE7SUFDdkQsQ0FBQyxDQUFBO0lBQ0QsTUFBTSxPQUFPLEdBQUcsQ0FBQyxLQUFhLEVBQUUsR0FBRyxDQUFNLEVBQUUsRUFBRTtRQUMzQyxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTtRQUM3QixPQUFPLENBQUMsR0FBRyxDQUFDLGVBQUssQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUE7SUFDdkQsQ0FBQyxDQUFBO0lBRUQsTUFBTSxPQUFPLEdBQUcsQ0FBQyxLQUFhLEVBQUUsR0FBRyxDQUFNLEVBQUUsRUFBRTtRQUMzQyxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTtRQUM3QixPQUFPLENBQUMsR0FBRyxDQUFDLGVBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUE7SUFDdEQsQ0FBQyxDQUFBO0lBRUQsT0FBTztRQUNMLFdBQVc7UUFDWCxTQUFTO1FBQ1QsS0FBSztRQUNMLElBQUk7UUFDSixPQUFPO1FBQ1AsT0FBTztRQUNQLFVBQVUsRUFBRSxDQUFDLEtBQWEsRUFBRSxFQUFFO1lBQzVCLE9BQU8sR0FBRyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUE7UUFDdkIsQ0FBQztRQUNELGtCQUFrQixFQUFFLENBQUMsUUFBaUIsS0FBSyxFQUFFLEVBQUU7WUFDN0MsZUFBZSxHQUFHLEtBQUssQ0FBQTtRQUN6QixDQUFDO0tBQ0YsQ0FBQTtBQUNILENBQUMsQ0FBQyxFQUFFLENBQUEifQ==