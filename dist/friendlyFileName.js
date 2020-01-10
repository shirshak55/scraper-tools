"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (s) => {
    return s
        .replace(/[^a-z0-9]/gi, '')
        .toLowerCase()
        .substring(0, 100);
};
//# sourceMappingURL=friendlyFileName.js.map