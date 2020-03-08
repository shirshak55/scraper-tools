import fsExtra from "fs-extra"

export function createDirectories(name: string): string {
  fsExtra.ensureDirSync(name)
  return name
}
