const hasRegistry = (state = {}) => {
  const registry = {};
  const self = {
    ...state,
    subscribe(...args) {
      if (args.length < 2) {
        return;
      }
      const [fn, ...topics] = args.reverse();
      const index = {};
      for (const t of topics) {
        if (!(t in registry)) {
          registry[t] = [];
        }
        registry[t] = registry[t].concat([fn]);
        index[t] = registry[t].length - 1;
      }
    },
    publish(topic, data) {
      // console.log('pub', topic, registry[topic])
      if (topic in registry && Array.isArray(registry[topic])) {
        registry[topic].forEach((fn) => fn(data));
      }
    },
  };

  return self;
};

export { hasRegistry };
