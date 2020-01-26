"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const createDirectories_1 = __importDefault(require("./createDirectories"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const os_1 = __importDefault(require("os"));
const util_1 = __importDefault(require("util"));
exports.default = (() => {
    let shouldLogToFile = false;
    let desktopPath = path_1.default.join(os_1.default.homedir(), "Desktop");
    let logPath = () => createDirectories_1.default(path_1.default.join(desktopPath, "logs/logs.txt"));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc29sZU1lc3NhZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvY29uc29sZU1lc3NhZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxrREFBMEI7QUFDMUIsNEVBQW9EO0FBQ3BELGdEQUF3QjtBQUN4Qiw0Q0FBb0I7QUFDcEIsNENBQW9CO0FBQ3BCLGdEQUF3QjtBQUV4QixrQkFBZSxDQUFDLEdBQUcsRUFBRTtJQUNuQixJQUFJLGVBQWUsR0FBRyxLQUFLLENBQUM7SUFDNUIsSUFBSSxXQUFXLEdBQUcsY0FBSSxDQUFDLElBQUksQ0FBQyxZQUFFLENBQUMsT0FBTyxFQUFFLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDckQsSUFBSSxPQUFPLEdBQUcsR0FBRyxFQUFFLENBQ2pCLDJCQUFpQixDQUFDLGNBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLGVBQWUsQ0FBQyxDQUFDLENBQUM7SUFFN0QsTUFBTSxPQUFPLEdBQUcsQ0FBQyxLQUFrRCxFQUFFLEVBQUU7UUFDckUsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLEVBQUU7WUFDN0IsT0FBTyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1NBQy9DO2FBQU07WUFDTCxPQUFPLElBQUksS0FBSyxHQUFHLENBQUM7U0FDckI7SUFDSCxDQUFDLENBQUM7SUFFRixNQUFNLFNBQVMsR0FBRyxDQUFDLEtBQWEsRUFBRSxPQUFZLEVBQUUsRUFBRTtRQUNoRCxJQUFJLENBQUMsZUFBZTtZQUFFLE9BQU87UUFDN0IsWUFBRSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsRUFBRSxjQUFJLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxJQUFJLEdBQUcsT0FBTyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7SUFDNUUsQ0FBQyxDQUFDO0lBRUYsTUFBTSxLQUFLLEdBQUcsQ0FBQyxLQUFhLEVBQUUsR0FBRyxDQUFNLEVBQUUsRUFBRTtRQUN6QyxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUM5QixPQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUM5RCxDQUFDLENBQUM7SUFDRixNQUFNLElBQUksR0FBRyxDQUFDLEtBQWEsRUFBRSxHQUFHLENBQU0sRUFBRSxFQUFFO1FBQ3hDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQzlCLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUN4RCxDQUFDLENBQUM7SUFDRixNQUFNLE9BQU8sR0FBRyxDQUFDLEtBQWEsRUFBRSxHQUFHLENBQU0sRUFBRSxFQUFFO1FBQzNDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQzlCLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUN4RCxDQUFDLENBQUM7SUFFRixNQUFNLE9BQU8sR0FBRyxDQUFDLEtBQWEsRUFBRSxHQUFHLENBQU0sRUFBRSxFQUFFO1FBQzNDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQzlCLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUN2RCxDQUFDLENBQUM7SUFFRixPQUFPO1FBQ0wsV0FBVztRQUNYLFNBQVM7UUFDVCxLQUFLO1FBQ0wsSUFBSTtRQUNKLE9BQU87UUFDUCxPQUFPO1FBQ1AsVUFBVSxFQUFFLENBQUMsS0FBYSxFQUFFLEVBQUU7WUFDNUIsT0FBTyxHQUFHLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQztRQUN4QixDQUFDO1FBQ0Qsa0JBQWtCLEVBQUUsQ0FBQyxRQUFpQixLQUFLLEVBQUUsRUFBRTtZQUM3QyxlQUFlLEdBQUcsS0FBSyxDQUFDO1FBQzFCLENBQUM7S0FDRixDQUFDO0FBQ0osQ0FBQyxDQUFDLEVBQUUsQ0FBQyJ9