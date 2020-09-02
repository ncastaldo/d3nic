
const proxyHandler = {
  get: (obj, fnName, receiver) => {
    return (...args) => {
      if (fnName in obj && typeof obj[fnName] === 'function') {
        const v = obj[fnName](...args)
        // undefined if no return value
        return v === undefined ? receiver : v
      }
      console.log(`No function ${fnName} here!`)
      return receiver
    }
  }
}

const getProxy = (obj) => {
  return new Proxy(obj, proxyHandler)
}

export { getProxy }
