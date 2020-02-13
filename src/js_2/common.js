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

export { hasRegistry }
