"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function waitForElement(selector) {
    return new Promise(function (resolve, reject) {
        let node;
        const element = document.querySelector(selector);
        if (element) {
            resolve(element);
            return;
        }
        var observer = new MutationObserver(function (mutations) {
            if ((node = document.querySelector(selector))) {
                observer.disconnect();
                resolve(node);
                return;
            }
        });
        observer.observe(document, { childList: true, subtree: true });
    });
}
function waitForElementToBeRemoved(selector) {
    return new Promise(function (resolve, reject) {
        let node;
        const element = document.querySelector(selector);
        if (!element) {
            resolve(true);
            return;
        }
        var observer = new MutationObserver(function (mutations) {
            if ((node = document.querySelector(selector))) {
                observer.disconnect();
                resolve(node);
                return;
            }
        });
        observer.observe(document, { childList: true, subtree: true });
    });
}
function flatten(arr) {
    return arr.reduce(function (flat, toFlatten) {
        return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
    }, []);
}
function triggerInputChange(node, value = "") {
    const inputTypes = [
        window.HTMLInputElement,
        window.HTMLSelectElement,
        window.HTMLTextAreaElement
    ];
    if (inputTypes.indexOf(node.__proto__.constructor) > -1) {
        const setValue = Object.getOwnPropertyDescriptor(node.__proto__, "value").set;
        const event = new Event("input", { bubbles: true });
        setValue.call(node, value);
        node.dispatchEvent(event);
    }
}
function delay(time) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}
exports.default = {
    waitForElement,
    waitForElementToBeRemoved,
    delay
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVuY3Rpb25Ub0luamVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9mdW5jdGlvblRvSW5qZWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsU0FBUyxjQUFjLENBQUMsUUFBZ0I7SUFDdEMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxVQUFTLE9BQU8sRUFBRSxNQUFNO1FBQ3pDLElBQUksSUFBSSxDQUFBO1FBQ1IsTUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQTtRQUNoRCxJQUFJLE9BQU8sRUFBRTtZQUNYLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQTtZQUNoQixPQUFNO1NBQ1A7UUFFRCxJQUFJLFFBQVEsR0FBRyxJQUFJLGdCQUFnQixDQUFDLFVBQVMsU0FBUztZQUNwRCxJQUFJLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRTtnQkFDN0MsUUFBUSxDQUFDLFVBQVUsRUFBRSxDQUFBO2dCQUNyQixPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7Z0JBQ2IsT0FBTTthQUNQO1FBQ0gsQ0FBQyxDQUFDLENBQUE7UUFDRixRQUFRLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUE7SUFDaEUsQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDO0FBRUQsU0FBUyx5QkFBeUIsQ0FBQyxRQUFhO0lBQzlDLE9BQU8sSUFBSSxPQUFPLENBQUMsVUFBUyxPQUFPLEVBQUUsTUFBTTtRQUN6QyxJQUFJLElBQUksQ0FBQTtRQUNSLE1BQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUE7UUFDaEQsSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNaLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTtZQUNiLE9BQU07U0FDUDtRQUVELElBQUksUUFBUSxHQUFHLElBQUksZ0JBQWdCLENBQUMsVUFBUyxTQUFTO1lBQ3BELElBQUksQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFO2dCQUM3QyxRQUFRLENBQUMsVUFBVSxFQUFFLENBQUE7Z0JBQ3JCLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTtnQkFDYixPQUFNO2FBQ1A7UUFDSCxDQUFDLENBQUMsQ0FBQTtRQUNGLFFBQVEsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQTtJQUNoRSxDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUM7QUFFRCxTQUFTLE9BQU8sQ0FBQyxHQUFRO0lBQ3ZCLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFTLElBQVMsRUFBRSxTQUFjO1FBQ2xELE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FDaEIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQzFELENBQUE7SUFDSCxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUE7QUFDUixDQUFDO0FBRUQsU0FBUyxrQkFBa0IsQ0FBQyxJQUFTLEVBQUUsS0FBSyxHQUFHLEVBQUU7SUFDL0MsTUFBTSxVQUFVLEdBQUc7UUFDaEIsTUFBYyxDQUFDLGdCQUFnQjtRQUMvQixNQUFjLENBQUMsaUJBQWlCO1FBQ2hDLE1BQWMsQ0FBQyxtQkFBbUI7S0FDcEMsQ0FBQTtJQUVELElBQUksVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFO1FBQ3ZELE1BQU0sUUFBUSxHQUFTLE1BQU0sQ0FBQyx3QkFBd0IsQ0FDcEQsSUFBSSxDQUFDLFNBQVMsRUFDZCxPQUFPLENBQ0EsQ0FBQyxHQUFHLENBQUE7UUFDYixNQUFNLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxPQUFPLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQTtRQUVuRCxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQTtRQUMxQixJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFBO0tBQzFCO0FBQ0gsQ0FBQztBQUVELFNBQVMsS0FBSyxDQUFDLElBQVk7SUFDekIsT0FBTyxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRTtRQUMzQixVQUFVLENBQUMsR0FBRyxFQUFFO1lBQ2QsT0FBTyxFQUFFLENBQUE7UUFDWCxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUE7SUFDVixDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUM7QUFFRCxrQkFBZTtJQUNiLGNBQWM7SUFDZCx5QkFBeUI7SUFDekIsS0FBSztDQUNOLENBQUEifQ==