/// Useful Functions to eject on puppetter so that we can use these functions in evaluate

function waitForElement(selector: string) {
  return new Promise(function(resolve, reject) {
    let node
    const element = document.querySelector(selector)
    if (element) {
      resolve(element)
      return
    }

    var observer = new MutationObserver(function(mutations) {
      if ((node = document.querySelector(selector))) {
        observer.disconnect()
        resolve(node)
        return
      }
    })
    observer.observe(document, { childList: true, subtree: true })
  })
}

function waitForElementToBeRemoved(selector: any) {
  return new Promise(function(resolve, reject) {
    let node
    const element = document.querySelector(selector)
    if (!element) {
      resolve(true)
      return
    }

    var observer = new MutationObserver(function(mutations) {
      if ((node = document.querySelector(selector))) {
        observer.disconnect()
        resolve(node)
        return
      }
    })
    observer.observe(document, { childList: true, subtree: true })
  })
}

function flatten(arr: any) {
  return arr.reduce(function(flat: any, toFlatten: any) {
    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten)
  }, [])
}

function triggerInputChange(node: any, value = "") {
  const inputTypes = [
    (window as any).HTMLInputElement,
    (window as any).HTMLSelectElement,
    (window as any).HTMLTextAreaElement
  ]
  // only process the change on elements we know have a value setter in their constructor
  if (inputTypes.indexOf(node.__proto__.constructor) > -1) {
    const setValue: any = (Object.getOwnPropertyDescriptor(node.__proto__, "value") as any).set
    const event = new Event("input", { bubbles: true })

    setValue.call(node, value)
    node.dispatchEvent(event)
  }
}

function delay(time: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}

export default {
  waitForElement,
  waitForElementToBeRemoved,
  delay
}
