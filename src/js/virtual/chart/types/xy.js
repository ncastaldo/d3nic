const hasXy = (state = {}) => {
  const self = {
    ...state,
    xRange() {
      return self.extent().map((point) => point[0]);
    },
    // not inverted
    yRange() {
      return self.extent().map((point) => point[1]);
    },
  };

  return self;
};

export { hasXy };
