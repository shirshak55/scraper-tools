import fs from "fs-extra";
import util from "util";
import consoleMessage from "./consoleMessage";

export default (err: any, path: string) => {
  consoleMessage.error("Error Logger", "We Got Error", err);
  fs.ensureFileSync(path);
  let log_file_err = fs.createWriteStream(path, { flags: "a" });
  log_file_err.write(util.format("Caught exception: " + err) + "\n");
  process.exit(1);
};
