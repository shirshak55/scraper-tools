import fsExtra from 'fs-extra'

export default (name): string => {
    fsExtra.ensureDirSync(name)
    return name
}
