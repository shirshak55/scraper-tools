"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (array, size) => {
    var results = [];
    while (array.length) {
        results.push(array.splice(0, size));
    }
    return results;
};
//# sourceMappingURL=chunks.js.map