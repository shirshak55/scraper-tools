"use strict";
// You can inject these functions so u can use it inside page evaluate callback.
Object.defineProperty(exports, "__esModule", { value: true });
exports.delay = exports.triggerInputChange = exports.flatten = exports.waitForElementToBeRemoved = exports.waitForElement = void 0;
// This is needed because we cannot do waitForEleemnt inside browser so we add shims.
function waitForElement(selector) {
    return new Promise(function (resolve) {
        var node;
        var element = document.querySelector(selector);
        if (element) {
            resolve(element);
            return;
        }
        var observer = new MutationObserver(function () {
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
        var node;
        var element = document.querySelector(selector);
        if (!element) {
            resolve(true);
            return;
        }
        var observer = new MutationObserver(function () {
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
function triggerInputChange(node, value) {
    if (value === void 0) { value = ""; }
    var inputTypes = [
        window.HTMLInputElement,
        window.HTMLSelectElement,
        window.HTMLTextAreaElement,
    ];
    // only process the change on elements we know have a value setter in their constructor
    if (inputTypes.indexOf(node.__proto__.constructor) > -1) {
        var setValue = Object.getOwnPropertyDescriptor(node.__proto__, "value").set;
        var event_1 = new Event("input", { bubbles: true });
        setValue.call(node, value);
        node.dispatchEvent(event_1);
    }
}
exports.triggerInputChange = triggerInputChange;
function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve(null);
        }, time);
    });
}
exports.delay = delay;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVuY3Rpb25Ub0luamVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9mdW5jdGlvblRvSW5qZWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxnRkFBZ0Y7OztBQUVoRixxRkFBcUY7QUFFckYsU0FBZ0IsY0FBYyxDQUFDLFFBQWdCO0lBQzdDLE9BQU8sSUFBSSxPQUFPLENBQUMsVUFBVSxPQUFPO1FBQ2xDLElBQUksSUFBSSxDQUFBO1FBQ1IsSUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQTtRQUNoRCxJQUFJLE9BQU8sRUFBRTtZQUNYLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQTtZQUNoQixPQUFNO1NBQ1A7UUFFRCxJQUFJLFFBQVEsR0FBRyxJQUFJLGdCQUFnQixDQUFDO1lBQ2xDLElBQUksQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFO2dCQUM3QyxRQUFRLENBQUMsVUFBVSxFQUFFLENBQUE7Z0JBQ3JCLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTtnQkFDYixPQUFNO2FBQ1A7UUFDSCxDQUFDLENBQUMsQ0FBQTtRQUNGLFFBQVEsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQTtJQUNoRSxDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUM7QUFsQkQsd0NBa0JDO0FBRUQsU0FBZ0IseUJBQXlCLENBQUMsUUFBYTtJQUNyRCxPQUFPLElBQUksT0FBTyxDQUFDLFVBQVUsT0FBTztRQUNsQyxJQUFJLElBQUksQ0FBQTtRQUNSLElBQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUE7UUFDaEQsSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNaLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTtZQUNiLE9BQU07U0FDUDtRQUVELElBQUksUUFBUSxHQUFHLElBQUksZ0JBQWdCLENBQUM7WUFDbEMsSUFBSSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUU7Z0JBQzdDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsQ0FBQTtnQkFDckIsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO2dCQUNiLE9BQU07YUFDUDtRQUNILENBQUMsQ0FBQyxDQUFBO1FBQ0YsUUFBUSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFBO0lBQ2hFLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQztBQWxCRCw4REFrQkM7QUFFRCxTQUFnQixPQUFPLENBQUMsR0FBUTtJQUM5QixPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBVSxJQUFTLEVBQUUsU0FBYztRQUNuRCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQTtJQUMvRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUE7QUFDUixDQUFDO0FBSkQsMEJBSUM7QUFFRCxTQUFnQixrQkFBa0IsQ0FBQyxJQUFTLEVBQUUsS0FBVTtJQUFWLHNCQUFBLEVBQUEsVUFBVTtJQUN0RCxJQUFNLFVBQVUsR0FBRztRQUNoQixNQUFjLENBQUMsZ0JBQWdCO1FBQy9CLE1BQWMsQ0FBQyxpQkFBaUI7UUFDaEMsTUFBYyxDQUFDLG1CQUFtQjtLQUNwQyxDQUFBO0lBQ0QsdUZBQXVGO0lBQ3ZGLElBQUksVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFO1FBQ3ZELElBQU0sUUFBUSxHQUFTLE1BQU0sQ0FBQyx3QkFBd0IsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBUyxDQUFDLEdBQUcsQ0FBQTtRQUMzRixJQUFNLE9BQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxPQUFPLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQTtRQUVuRCxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQTtRQUMxQixJQUFJLENBQUMsYUFBYSxDQUFDLE9BQUssQ0FBQyxDQUFBO0tBQzFCO0FBQ0gsQ0FBQztBQWRELGdEQWNDO0FBRUQsU0FBZ0IsS0FBSyxDQUFDLElBQVk7SUFDaEMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU87UUFDekIsVUFBVSxDQUFDO1lBQ1QsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ2YsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFBO0lBQ1YsQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDO0FBTkQsc0JBTUMifQ==