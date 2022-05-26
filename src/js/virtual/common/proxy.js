const proxyHandler = {
  get: (obj, fnName, receiver) => {
    return (...args) => {
      if (fnName in obj && typeof obj[fnName] === "function") {
        const v = obj[fnName](...args);
        // check on args length because v may not be undefined
        if (fnName !== "draw" && !args.length) {
          return v;
        }
      } else {
        console.log(`No function ${fnName} here!`);
      }
      return receiver;
    };
  },
};

const getProxy = (obj) => {
  return new Proxy(obj, proxyHandler);
};

export { getProxy };
