"use strict";
// You can inject these functions so u can use it inside page evaluate callback.
Object.defineProperty(exports, "__esModule", { value: true });
exports.delay = exports.triggerInputChange = exports.flatten = exports.waitForElementToBeRemoved = exports.waitForElement = void 0;
// This is needed because we cannot do waitForEleemnt inside browser so we add shims.
function waitForElement(selector) {
    return new Promise(function (resolve) {
        let node;
        const element = document.querySelector(selector);
        if (element) {
            resolve(element);
            return;
        }
        let observer = new MutationObserver(function () {
            if ((node = document.querySelector(selector))) {
                observer.disconnect();
                resolve(node);
                return;
            }
        });
        observer.observe(document, { childList: true, subtree: true });
    });
}
exports.waitForElement = waitForElement;
function waitForElementToBeRemoved(selector) {
    return new Promise(function (resolve) {
        let node;
        const element = document.querySelector(selector);
        if (!element) {
            resolve(true);
            return;
        }
        let observer = new MutationObserver(function () {
            if ((node = document.querySelector(selector))) {
                observer.disconnect();
                resolve(node);
                return;
            }
        });
        observer.observe(document, { childList: true, subtree: true });
    });
}
exports.waitForElementToBeRemoved = waitForElementToBeRemoved;
function flatten(arr) {
    return arr.reduce(function (flat, toFlatten) {
        return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
    }, []);
}
exports.flatten = flatten;
function triggerInputChange(node, value = "") {
    const inputTypes = [
        window.HTMLInputElement,
        window.HTMLSelectElement,
        window.HTMLTextAreaElement,
    ];
    // only process the change on elements we know have a value setter in their constructor
    if (inputTypes.indexOf(node.__proto__.constructor) > -1) {
        const setValue = Object.getOwnPropertyDescriptor(node.__proto__, "value").set;
        const event = new Event("input", { bubbles: true });
        setValue.call(node, value);
        node.dispatchEvent(event);
    }
}
exports.triggerInputChange = triggerInputChange;
function delay(time) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(null);
        }, time);
    });
}
exports.delay = delay;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVuY3Rpb25Ub0luamVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9mdW5jdGlvblRvSW5qZWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxnRkFBZ0Y7OztBQUVoRixxRkFBcUY7QUFFckYsU0FBZ0IsY0FBYyxDQUFDLFFBQWdCO0lBQzdDLE9BQU8sSUFBSSxPQUFPLENBQUMsVUFBVSxPQUFPO1FBQ2xDLElBQUksSUFBSSxDQUFBO1FBQ1IsTUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQTtRQUNoRCxJQUFJLE9BQU8sRUFBRTtZQUNYLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQTtZQUNoQixPQUFNO1NBQ1A7UUFFRCxJQUFJLFFBQVEsR0FBRyxJQUFJLGdCQUFnQixDQUFDO1lBQ2xDLElBQUksQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFO2dCQUM3QyxRQUFRLENBQUMsVUFBVSxFQUFFLENBQUE7Z0JBQ3JCLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTtnQkFDYixPQUFNO2FBQ1A7UUFDSCxDQUFDLENBQUMsQ0FBQTtRQUNGLFFBQVEsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQTtJQUNoRSxDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUM7QUFsQkQsd0NBa0JDO0FBRUQsU0FBZ0IseUJBQXlCLENBQUMsUUFBYTtJQUNyRCxPQUFPLElBQUksT0FBTyxDQUFDLFVBQVUsT0FBTztRQUNsQyxJQUFJLElBQUksQ0FBQTtRQUNSLE1BQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUE7UUFDaEQsSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNaLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTtZQUNiLE9BQU07U0FDUDtRQUVELElBQUksUUFBUSxHQUFHLElBQUksZ0JBQWdCLENBQUM7WUFDbEMsSUFBSSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUU7Z0JBQzdDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsQ0FBQTtnQkFDckIsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO2dCQUNiLE9BQU07YUFDUDtRQUNILENBQUMsQ0FBQyxDQUFBO1FBQ0YsUUFBUSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFBO0lBQ2hFLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQztBQWxCRCw4REFrQkM7QUFFRCxTQUFnQixPQUFPLENBQUMsR0FBUTtJQUM5QixPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBVSxJQUFTLEVBQUUsU0FBYztRQUNuRCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQTtJQUMvRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUE7QUFDUixDQUFDO0FBSkQsMEJBSUM7QUFFRCxTQUFnQixrQkFBa0IsQ0FBQyxJQUFTLEVBQUUsS0FBSyxHQUFHLEVBQUU7SUFDdEQsTUFBTSxVQUFVLEdBQUc7UUFDaEIsTUFBYyxDQUFDLGdCQUFnQjtRQUMvQixNQUFjLENBQUMsaUJBQWlCO1FBQ2hDLE1BQWMsQ0FBQyxtQkFBbUI7S0FDcEMsQ0FBQTtJQUNELHVGQUF1RjtJQUN2RixJQUFJLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRTtRQUN2RCxNQUFNLFFBQVEsR0FBUyxNQUFNLENBQUMsd0JBQXdCLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQVMsQ0FBQyxHQUFHLENBQUE7UUFDM0YsTUFBTSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsT0FBTyxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUE7UUFFbkQsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUE7UUFDMUIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQTtLQUMxQjtBQUNILENBQUM7QUFkRCxnREFjQztBQUVELFNBQWdCLEtBQUssQ0FBQyxJQUFZO0lBQ2hDLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRTtRQUM3QixVQUFVLENBQUMsR0FBRyxFQUFFO1lBQ2QsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ2YsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFBO0lBQ1YsQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDO0FBTkQsc0JBTUMifQ==