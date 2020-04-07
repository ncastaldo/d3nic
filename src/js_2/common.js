const hasRegistry = () => {
  const registry = {}
  return {
    // registry
    subscribe: (topic, ...fn) => {
      // console.log('sub', topic, fn)
      if (!(topic in registry)) { registry[topic] = [] }
      registry[topic] = registry[topic].concat(fn)
    },
    publish: (topic, data) => {
      // console.log('pub', topic, registry[topic])
      if (topic in registry && Array.isArray(registry[topic])) { registry[topic].forEach(fn => fn(data)) }
    },
    log: () => {
      console.log(registry)
    }
  }
}

const chartProxyHandler = {
  get: (chart, fnName) => {
    return (...args) => {
      if (fnName in chart && typeof chart[fnName] === 'function') {
        if (fnName === 'draw' || args.length) {
          chart[fnName](...args)

          chart.publish(fnName, chart)
          chart.components().forEach(c => c.publish(fnName, chart))

          return new Proxy(chart, chartProxyHandler)
        } else {
          return chart[fnName]()
        }
      }
      console.log(`no function ${fnName} here`)
      return undefined
    }
  }
}
const chartProxy = (chart) => {
  const proxy = new Proxy(chart, chartProxyHandler)
  proxy.publish('data', chart)
  proxy.publish('size', chart)
  return proxy
}

const componentProxyHandler = {
  get: (component, fnName) => {
    return (...args) => {
      if (fnName in component && typeof component[fnName] === 'function') {
        if (args.length) {
          component[fnName](...args)

          // to achieve clean code and avoid calling functions directly after changes
          component.publish(fnName)

          return new Proxy(component, componentProxyHandler)
        } else {
          return component[fnName]()
        }
      }
      console.log(`no function ${fnName} here`)
      return undefined
    }
  }
}
const componentProxy = (chart) => {
  return new Proxy(chart, componentProxyHandler)
}

export { hasRegistry, chartProxy, componentProxy }
