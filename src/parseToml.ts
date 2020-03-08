import toml from "toml"
import fs, { PathLike } from "fs"

export function parseToml(path: PathLike) {
  return toml.parse(fs.readFileSync(path).toString())
}
