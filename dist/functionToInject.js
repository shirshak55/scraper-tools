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
    return new Promise((resolve) => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVuY3Rpb25Ub0luamVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9mdW5jdGlvblRvSW5qZWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsU0FBUyxjQUFjLENBQUMsUUFBZ0I7SUFDdEMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxVQUFTLE9BQU8sRUFBRSxNQUFNO1FBQ3pDLElBQUksSUFBSSxDQUFBO1FBQ1IsTUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQTtRQUNoRCxJQUFJLE9BQU8sRUFBRTtZQUNYLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQTtZQUNoQixPQUFNO1NBQ1A7UUFFRCxJQUFJLFFBQVEsR0FBRyxJQUFJLGdCQUFnQixDQUFDLFVBQVMsU0FBUztZQUNwRCxJQUFJLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRTtnQkFDN0MsUUFBUSxDQUFDLFVBQVUsRUFBRSxDQUFBO2dCQUNyQixPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7Z0JBQ2IsT0FBTTthQUNQO1FBQ0gsQ0FBQyxDQUFDLENBQUE7UUFDRixRQUFRLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUE7SUFDaEUsQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDO0FBRUQsU0FBUyx5QkFBeUIsQ0FBQyxRQUFhO0lBQzlDLE9BQU8sSUFBSSxPQUFPLENBQUMsVUFBUyxPQUFPLEVBQUUsTUFBTTtRQUN6QyxJQUFJLElBQUksQ0FBQTtRQUNSLE1BQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUE7UUFDaEQsSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNaLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTtZQUNiLE9BQU07U0FDUDtRQUVELElBQUksUUFBUSxHQUFHLElBQUksZ0JBQWdCLENBQUMsVUFBUyxTQUFTO1lBQ3BELElBQUksQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFO2dCQUM3QyxRQUFRLENBQUMsVUFBVSxFQUFFLENBQUE7Z0JBQ3JCLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTtnQkFDYixPQUFNO2FBQ1A7UUFDSCxDQUFDLENBQUMsQ0FBQTtRQUNGLFFBQVEsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQTtJQUNoRSxDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUM7QUFFRCxTQUFTLE9BQU8sQ0FBQyxHQUFRO0lBQ3ZCLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFTLElBQVMsRUFBRSxTQUFjO1FBQ2xELE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFBO0lBQy9FLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQTtBQUNSLENBQUM7QUFFRCxTQUFTLGtCQUFrQixDQUFDLElBQVMsRUFBRSxLQUFLLEdBQUcsRUFBRTtJQUMvQyxNQUFNLFVBQVUsR0FBRztRQUNoQixNQUFjLENBQUMsZ0JBQWdCO1FBQy9CLE1BQWMsQ0FBQyxpQkFBaUI7UUFDaEMsTUFBYyxDQUFDLG1CQUFtQjtLQUNwQyxDQUFBO0lBRUQsSUFBSSxVQUFVLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUU7UUFDdkQsTUFBTSxRQUFRLEdBQVMsTUFBTSxDQUFDLHdCQUF3QixDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFTLENBQUMsR0FBRyxDQUFBO1FBQzNGLE1BQU0sS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLE9BQU8sRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFBO1FBRW5ELFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFBO1FBQzFCLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUE7S0FDMUI7QUFDSCxDQUFDO0FBRUQsU0FBUyxLQUFLLENBQUMsSUFBWTtJQUN6QixPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUU7UUFDN0IsVUFBVSxDQUFDLEdBQUcsRUFBRTtZQUNkLE9BQU8sRUFBRSxDQUFBO1FBQ1gsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFBO0lBQ1YsQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDO0FBRUQsa0JBQWU7SUFDYixjQUFjO0lBQ2QseUJBQXlCO0lBQ3pCLEtBQUs7Q0FDTixDQUFBIn0=