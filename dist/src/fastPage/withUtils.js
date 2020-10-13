"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withUtilsInitScript = exports.withUtilsEvaluate = void 0;
const utils_1 = __importDefault(require("./utils"));
async function withUtilsEvaluate(page, mainFunction, ...args) {
    return page.evaluate(({ _utilsFns, _mainFunction, _args }) => {
        const utils = Object.fromEntries(Object.entries(_utilsFns).map(([key, value]) => [key, eval(value)]));
        utils.preloadCache();
        return eval(_mainFunction)(utils, ..._args);
    }, {
        _utilsFns: utils_1.default.stringifyFns(utils_1.default),
        _mainFunction: mainFunction.toString(),
        _args: args || []
    });
}
exports.withUtilsEvaluate = withUtilsEvaluate;
async function withUtilsInitScript(context, mainFunction, ...args) {
    return context.addInitScript(({ _utilsFns, _mainFunction, _args }) => {
        const utils = Object.fromEntries(Object.entries(_utilsFns).map(([key, value]) => [key, eval(value)]));
        utils.preloadCache();
        return eval(_mainFunction)(utils, ..._args);
    }, {
        _utilsFns: utils_1.default.stringifyFns(utils_1.default),
        _mainFunction: mainFunction.toString(),
        _args: args || []
    });
}
exports.withUtilsInitScript = withUtilsInitScript;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2l0aFV0aWxzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2Zhc3RQYWdlL3dpdGhVdGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSxvREFBMkI7QUFLcEIsS0FBSyxVQUFVLGlCQUFpQixDQUFDLElBQVUsRUFBRSxZQUFZLEVBQUUsR0FBRyxJQUFJO0lBQ3JFLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FDbEIsQ0FBQyxFQUFFLFNBQVMsRUFBRSxhQUFhLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRTtRQUV0QyxNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsV0FBVyxDQUM5QixNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsS0FBZSxDQUFDLENBQUMsQ0FBQyxDQUM5RSxDQUFBO1FBQ0QsS0FBSyxDQUFDLFlBQVksRUFBRSxDQUFBO1FBQ3BCLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLEtBQUssRUFBRSxHQUFHLEtBQUssQ0FBQyxDQUFBO0lBQzdDLENBQUMsRUFDRDtRQUNFLFNBQVMsRUFBRSxlQUFLLENBQUMsWUFBWSxDQUFDLGVBQUssQ0FBQztRQUNwQyxhQUFhLEVBQUUsWUFBWSxDQUFDLFFBQVEsRUFBRTtRQUN0QyxLQUFLLEVBQUUsSUFBSSxJQUFJLEVBQUU7S0FDbEIsQ0FDRixDQUFBO0FBQ0wsQ0FBQztBQWhCRCw4Q0FnQkM7QUFJTSxLQUFLLFVBQVUsbUJBQW1CLENBQUMsT0FBc0IsRUFBRSxZQUFZLEVBQUUsR0FBRyxJQUFJO0lBQ25GLE9BQU8sT0FBTyxDQUFDLGFBQWEsQ0FDMUIsQ0FBQyxFQUFFLFNBQVMsRUFBRSxhQUFhLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRTtRQUV0QyxNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsV0FBVyxDQUM5QixNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsS0FBZSxDQUFDLENBQUMsQ0FBQyxDQUM5RSxDQUFBO1FBQ0QsS0FBSyxDQUFDLFlBQVksRUFBRSxDQUFBO1FBQ3BCLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLEtBQUssRUFBRSxHQUFHLEtBQUssQ0FBQyxDQUFBO0lBQzdDLENBQUMsRUFDRDtRQUNFLFNBQVMsRUFBRSxlQUFLLENBQUMsWUFBWSxDQUFDLGVBQUssQ0FBQztRQUNwQyxhQUFhLEVBQUUsWUFBWSxDQUFDLFFBQVEsRUFBRTtRQUN0QyxLQUFLLEVBQUUsSUFBSSxJQUFJLEVBQUU7S0FDbEIsQ0FDRixDQUFBO0FBQ0gsQ0FBQztBQWhCSCxrREFnQkcifQ==