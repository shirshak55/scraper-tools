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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3NoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3NzaC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHNFQUE2QztBQUM3Qyx3REFBK0I7QUFLL0Isa0JBQWUsQ0FBQyxHQUFHLEVBQUU7SUFDbkIsSUFBSSxPQUFPLENBQUE7SUFDWCxPQUFPO1FBQ0wsT0FBTyxFQUFFLEtBQUssSUFBSSxFQUFFO1lBQ2xCLElBQUksQ0FBQyxPQUFPLEVBQUU7Z0JBQ1osTUFBTSxzQkFBc0IsQ0FBQTthQUM3QjtZQUNELE9BQU8sT0FBTyxDQUFBO1FBQ2hCLENBQUM7UUFDRCxPQUFPLEVBQUUsS0FBSyxFQUFFLEVBQ2QsSUFBSSxFQUNKLElBQUksRUFDSixRQUFRLEVBQ1IsY0FBYyxHQU1mLEVBQUUsRUFBRTtZQUNILElBQUk7Z0JBQ0YsSUFBSSxHQUFHLEdBQUcsSUFBSSxrQkFBUSxFQUFFLENBQUE7Z0JBQ3hCLE9BQU8sR0FBRyxNQUFNLEdBQUcsQ0FBQyxPQUFPLENBQUM7b0JBQzFCLElBQUk7b0JBQ0osSUFBSTtvQkFDSixRQUFRO29CQUNSLFVBQVUsRUFBRSxjQUFjO2lCQUMzQixDQUFDLENBQUE7Z0JBQ0YsT0FBTyxPQUFPLENBQUE7YUFDZjtZQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUNWLHdCQUFjLENBQUMsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUMsQ0FBQTthQUN4QztRQUNILENBQUM7S0FDRixDQUFBO0FBQ0gsQ0FBQyxDQUFDLEVBQUUsQ0FBQSJ9