import fs from "fs";

export default (filename: string): string => {
  return fs.readFileSync(filename).toString();
};
