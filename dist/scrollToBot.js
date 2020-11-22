"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrollToBottom = void 0;
function scrollToBottom(page) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, page.evaluate(function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, new Promise(function (resolve) {
                                        var totalHeight = 0;
                                        var distance = 100;
                                        var timer = setInterval(function () {
                                            var scrollHeight = document.body.scrollHeight;
                                            window.scrollBy(0, distance);
                                            totalHeight += distance;
                                            if (totalHeight >= scrollHeight) {
                                                clearInterval(timer);
                                                resolve(null);
                                            }
                                        }, 30);
                                    })];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.scrollToBottom = scrollToBottom;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Nyb2xsVG9Cb3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvc2Nyb2xsVG9Cb3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsU0FBc0IsY0FBYyxDQUFDLElBQVU7Ozs7O3dCQUM3QyxxQkFBTSxJQUFJLENBQUMsUUFBUSxDQUFDOzs7d0NBQ2xCLHFCQUFNLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTzt3Q0FDeEIsSUFBSSxXQUFXLEdBQUcsQ0FBQyxDQUFBO3dDQUNuQixJQUFJLFFBQVEsR0FBRyxHQUFHLENBQUE7d0NBQ2xCLElBQUksS0FBSyxHQUFHLFdBQVcsQ0FBQzs0Q0FDdEIsSUFBSSxZQUFZLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUE7NENBQzdDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFBOzRDQUM1QixXQUFXLElBQUksUUFBUSxDQUFBOzRDQUV2QixJQUFJLFdBQVcsSUFBSSxZQUFZLEVBQUU7Z0RBQy9CLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQTtnREFDcEIsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBOzZDQUNkO3dDQUNILENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQTtvQ0FDUixDQUFDLENBQUMsRUFBQTs7b0NBYkYsU0FhRSxDQUFBOzs7O3lCQUNILENBQUMsRUFBQTs7b0JBZkYsU0FlRSxDQUFBOzs7OztDQUNIO0FBakJELHdDQWlCQyJ9