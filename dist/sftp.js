"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ssh2_sftp_client_1 = __importDefault(require("ssh2-sftp-client"));
const consoleMessage_1 = __importDefault(require("./consoleMessage"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
exports.default = (() => {
    let sftpHandler;
    return {
        upload: async ({ host, port, username, privatekeyPath, filePath, remoteFilePath, }) => {
            try {
                let sftp = new ssh2_sftp_client_1.default();
                await sftp.connect({
                    host,
                    port,
                    username,
                    privateKey: fs_1.default.readFileSync(privatekeyPath),
                });
                let sftpHandler = sftp;
                try {
                    await sftp.mkdir(path_1.default.dirname(remoteFilePath), true);
                }
                catch (e) { }
                await sftp.put(filePath, remoteFilePath);
                await sftp.end();
            }
            catch (e) {
                consoleMessage_1.default.error('SSH Uploader Module', e);
            }
        },
        handler: async () => {
            if (!sftpHandler) {
                throw 'No SSH Handler found';
            }
            return sftpHandler;
        },
    };
})();
//# sourceMappingURL=sftp.js.map