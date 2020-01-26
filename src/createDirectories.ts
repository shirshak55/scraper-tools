import fsExtra from "fs-extra";

export default (name: string): string => {
  fsExtra.ensureDirSync(name);
  return name;
};
