"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const consoleMessage_1 = __importDefault(require("./consoleMessage"));
const node_ssh_1 = __importDefault(require("node-ssh"));
exports.default = (() => {
    let handler;
    return {
        handler: async () => {
            if (!handler) {
                throw 'No SSH Handler found';
            }
            return handler;
        },
        connect: async ({ host, port, username, privatekeyPath, }) => {
            try {
                let ssh = new node_ssh_1.default();
                handler = await ssh.connect({
                    host,
                    port,
                    username,
                    privateKey: privatekeyPath,
                });
                return handler;
            }
            catch (e) {
                consoleMessage_1.default.error('Error at ssh', e);
            }
        },
    };
})();
//# sourceMappingURL=ssh.js.map