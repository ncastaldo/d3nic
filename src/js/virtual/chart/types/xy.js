const hasXy = (state = {}) => {
  const self = {
    ...state,
    xRange () {
      return this.extent()
        .map(point => point[0])
    },
    // not inverted
    yRange () {
      return this.extent()
        .map(point => point[1])
    }
  }

  return self
}

export { hasXy }
