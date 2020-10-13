"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.consoleMessage = void 0;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc29sZU1lc3NhZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29uc29sZU1lc3NhZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsa0RBQXlCO0FBQ3pCLDJEQUF1RDtBQUN2RCxnREFBdUI7QUFDdkIsNENBQW1CO0FBQ25CLDRDQUFtQjtBQUNuQixnREFBdUI7QUFFVixRQUFBLGNBQWMsR0FBRyxDQUFDLEdBQUcsRUFBRTtJQUNsQyxJQUFJLGVBQWUsR0FBRyxLQUFLLENBQUE7SUFDM0IsSUFBSSxXQUFXLEdBQUcsY0FBSSxDQUFDLElBQUksQ0FBQyxZQUFFLENBQUMsT0FBTyxFQUFFLEVBQUUsU0FBUyxDQUFDLENBQUE7SUFDcEQsSUFBSSxPQUFPLEdBQUcsR0FBRyxFQUFFLENBQUMscUNBQWlCLENBQUMsY0FBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsZUFBZSxDQUFDLENBQUMsQ0FBQTtJQUU5RSxNQUFNLE9BQU8sR0FBRyxDQUFDLEtBQWtELEVBQUUsRUFBRTtRQUNyRSxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsRUFBRTtZQUM3QixPQUFPLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUE7U0FDOUM7YUFBTTtZQUNMLE9BQU8sSUFBSSxLQUFLLEdBQUcsQ0FBQTtTQUNwQjtJQUNILENBQUMsQ0FBQTtJQUVELE1BQU0sU0FBUyxHQUFHLENBQUMsS0FBYSxFQUFFLE9BQVksRUFBRSxFQUFFO1FBQ2hELElBQUksQ0FBQyxlQUFlO1lBQUUsT0FBTTtRQUM1QixZQUFFLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxFQUFFLGNBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLElBQUksR0FBRyxPQUFPLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQTtJQUMzRSxDQUFDLENBQUE7SUFFRCxNQUFNLEtBQUssR0FBRyxDQUFDLEtBQWEsRUFBRSxHQUFHLENBQU0sRUFBRSxFQUFFO1FBQ3pDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFBO1FBQzdCLE9BQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFBO0lBQzdELENBQUMsQ0FBQTtJQUNELE1BQU0sSUFBSSxHQUFHLENBQUMsS0FBYSxFQUFFLEdBQUcsQ0FBTSxFQUFFLEVBQUU7UUFDeEMsU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7UUFDN0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFBO0lBQ3ZELENBQUMsQ0FBQTtJQUNELE1BQU0sT0FBTyxHQUFHLENBQUMsS0FBYSxFQUFFLEdBQUcsQ0FBTSxFQUFFLEVBQUU7UUFDM0MsU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7UUFDN0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFBO0lBQ3ZELENBQUMsQ0FBQTtJQUVELE1BQU0sT0FBTyxHQUFHLENBQUMsS0FBYSxFQUFFLEdBQUcsQ0FBTSxFQUFFLEVBQUU7UUFDM0MsU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUE7UUFDN0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFBO0lBQ3RELENBQUMsQ0FBQTtJQUVELE9BQU87UUFDTCxXQUFXO1FBQ1gsU0FBUztRQUNULEtBQUs7UUFDTCxJQUFJO1FBQ0osT0FBTztRQUNQLE9BQU87UUFDUCxVQUFVLEVBQUUsQ0FBQyxLQUFhLEVBQUUsRUFBRTtZQUM1QixPQUFPLEdBQUcsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFBO1FBQ3ZCLENBQUM7UUFDRCxrQkFBa0IsRUFBRSxDQUFDLFFBQWlCLEtBQUssRUFBRSxFQUFFO1lBQzdDLGVBQWUsR0FBRyxLQUFLLENBQUE7UUFDekIsQ0FBQztLQUNGLENBQUE7QUFDSCxDQUFDLENBQUMsRUFBRSxDQUFBIn0=