import chalk from "chalk";
import createDirectories from "./createDirectories";
import path from "path";
import fs from "fs";
import os from "os";
import util from "util";

export default (() => {
  let shouldLogToFile = false;
  let desktopPath = path.join(os.homedir(), "Desktop");
  let logPath = () =>
    createDirectories(path.join(desktopPath, "logs/logs.txt"));

  const titlify = (title: string | { title: string; padding: number }) => {
    if (typeof title === "object") {
      return title.title.padEnd(title.padding, " ");
    } else {
      return `[${title}]`;
    }
  };

  const logToFile = (title: string, content: any) => {
    if (!shouldLogToFile) return;
    fs.appendFileSync(logPath(), util.format(`[${title}] ` + content) + "\n");
  };

  const error = (title: string, ...s: any) => {
    logToFile(title, s.join(" "));
    return console.log(chalk.bgRed.green(titlify(title)), ...s);
  };
  const info = (title: string, ...s: any) => {
    logToFile(title, s.join(" "));
    console.log(chalk.bgBlue.white(titlify(title)), ...s);
  };
  const warning = (title: string, ...s: any) => {
    logToFile(title, s.join(" "));
    console.log(chalk.bgYellow.red(titlify(title)), ...s);
  };

  const success = (title: string, ...s: any) => {
    logToFile(title, s.join(" "));
    console.log(chalk.bgGreen.red(titlify(title)), ...s);
  };

  return {
    desktopPath,
    logToFile,
    error,
    info,
    warning,
    success,
    setLogPath: (value: string) => {
      logPath = () => value;
    },
    setShouldLogToFile: (value: boolean = false) => {
      shouldLogToFile = value;
    }
  };
})();
