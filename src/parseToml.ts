import toml from "toml";
import fs, { PathLike } from "fs";

export default function parseToml(path: PathLike) {
  return toml.parse(fs.readFileSync(path).toString());
}
