import { PathLike } from "fs";
import { promisify } from "util";
import fs from "fs";

const stat = promisify(fs.stat);

export default async function(filePath: PathLike): Promise<boolean> {
  try {
    await stat(filePath);
    return true;
  } catch (err) {
    return false;
  }
}
