"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.friendlyFileName = void 0;
function friendlyFileName(s) {
    return s
        .replace(/[^a-z0-9]/gi, "")
        .toLowerCase()
        .substring(0, 100);
}
exports.friendlyFileName = friendlyFileName;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJpZW5kbHlGaWxlTmFtZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9mcmllbmRseUZpbGVOYW1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLFNBQWdCLGdCQUFnQixDQUFDLENBQVM7SUFDeEMsT0FBTyxDQUFDO1NBQ0wsT0FBTyxDQUFDLGFBQWEsRUFBRSxFQUFFLENBQUM7U0FDMUIsV0FBVyxFQUFFO1NBQ2IsU0FBUyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQTtBQUN0QixDQUFDO0FBTEQsNENBS0MifQ==