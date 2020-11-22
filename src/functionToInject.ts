// You can inject these functions so u can use it inside page evaluate callback.

// This is needed because we cannot do waitForEleemnt inside browser so we add shims.

export function waitForElement(selector: string) {
  return new Promise(function (resolve) {
    let node
    const element = document.querySelector(selector)
    if (element) {
      resolve(element)
      return
    }

    let observer = new MutationObserver(function () {
      if ((node = document.querySelector(selector))) {
        observer.disconnect()
        resolve(node)
        return
      }
    })
    observer.observe(document, { childList: true, subtree: true })
  })
}

export function waitForElementToBeRemoved(selector: any) {
  return new Promise(function (resolve) {
    let node
    const element = document.querySelector(selector)
    if (!element) {
      resolve(true)
      return
    }

    let observer = new MutationObserver(function () {
      if ((node = document.querySelector(selector))) {
        observer.disconnect()
        resolve(node)
        return
      }
    })
    observer.observe(document, { childList: true, subtree: true })
  })
}

export function flatten(arr: any) {
  return arr.reduce(function (flat: any, toFlatten: any) {
    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten)
  }, [])
}

export function triggerInputChange(node: any, value = "") {
  const inputTypes = [
    (window as any).HTMLInputElement,
    (window as any).HTMLSelectElement,
    (window as any).HTMLTextAreaElement,
  ]
  // only process the change on elements we know have a value setter in their constructor
  if (inputTypes.indexOf(node.__proto__.constructor) > -1) {
    const setValue: any = (Object.getOwnPropertyDescriptor(node.__proto__, "value") as any).set
    const event = new Event("input", { bubbles: true })

    setValue.call(node, value)
    node.dispatchEvent(event)
  }
}

export function delay(time: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(null)
    }, time)
  })
}
