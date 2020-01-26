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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Z0cC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9zZnRwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsd0VBQXlDO0FBQ3pDLHNFQUE2QztBQUM3Qyw0Q0FBbUI7QUFDbkIsZ0RBQXVCO0FBS3ZCLGtCQUFlLENBQUMsR0FBRyxFQUFFO0lBQ25CLElBQUksV0FBVyxDQUFBO0lBQ2YsT0FBTztRQUNMLE1BQU0sRUFBRSxLQUFLLEVBQUUsRUFDYixJQUFJLEVBQ0osSUFBSSxFQUNKLFFBQVEsRUFDUixjQUFjLEVBQ2QsUUFBUSxFQUNSLGNBQWMsR0FRZixFQUFFLEVBQUU7WUFDSCxJQUFJO2dCQUNGLElBQUksSUFBSSxHQUFHLElBQUksMEJBQVUsRUFBRSxDQUFBO2dCQUMzQixNQUFNLElBQUksQ0FBQyxPQUFPLENBQUM7b0JBQ2pCLElBQUk7b0JBQ0osSUFBSTtvQkFDSixRQUFRO29CQUNSLFVBQVUsRUFBRSxZQUFFLENBQUMsWUFBWSxDQUFDLGNBQWMsQ0FBQztpQkFDNUMsQ0FBQyxDQUFBO2dCQUNGLElBQUksV0FBVyxHQUFHLElBQUksQ0FBQTtnQkFDdEIsSUFBSTtvQkFDRixNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQTtpQkFDckQ7Z0JBQUMsT0FBTyxDQUFDLEVBQUUsR0FBRTtnQkFDZCxNQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLGNBQWMsQ0FBQyxDQUFBO2dCQUN4QyxNQUFNLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQTthQUNqQjtZQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUNWLHdCQUFjLENBQUMsS0FBSyxDQUFDLHFCQUFxQixFQUFFLENBQUMsQ0FBQyxDQUFBO2FBQy9DO1FBQ0gsQ0FBQztRQUNELE9BQU8sRUFBRSxLQUFLLElBQUksRUFBRTtZQUNsQixJQUFJLENBQUMsV0FBVyxFQUFFO2dCQUNoQixNQUFNLHNCQUFzQixDQUFBO2FBQzdCO1lBQ0QsT0FBTyxXQUFXLENBQUE7UUFDcEIsQ0FBQztLQUNGLENBQUE7QUFDSCxDQUFDLENBQUMsRUFBRSxDQUFBIn0=