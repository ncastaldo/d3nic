const hasRegistry = () => {
  const registry = {}
  return {
    // registry
    subscribe: (topic, fn) => {
      if (!(topic in registry)) { registry[topic] = [] }
      registry[topic].push(fn)
    },
    publish: (topic, data) => {
      if (topic in registry && Array.isArray(registry[topic])) { registry[topic].forEach(fn => fn(data)) }
    }
  }
}

const proxyHandler = {
  get: (chart, fn) => {
    return (...args) => {
      if (fn in chart && typeof chart[fn] === 'function') {
        if (fn === 'draw' || args.length) {
          chart[fn](...args)

          chart.publish(fn, chart)
          chart.components().forEach(c => c.publish(fn, chart))

          return new Proxy(chart, proxyHandler)
        } else {
          return chart[fn]()
        }
      }
      console.log(`no function ${fn} here`)
      return undefined
    }
  }
}
const chartProxy = (chart) => {
  return new Proxy(chart, proxyHandler)
}

export { hasRegistry, chartProxy }
