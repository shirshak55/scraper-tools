import toml from 'toml'
import fs from 'fs'

export default function parseToml(path) {
  return toml.parse(fs.readFileSync(path).toString())
}
