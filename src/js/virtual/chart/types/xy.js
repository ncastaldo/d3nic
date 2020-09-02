const hasXy = (state = {}) => {
  let xRange = [0, 1]
  let yRange = [0, 1]

  const self = {
    ...state,
    xRange: () => {
      return xRange
    },
    // not inverted
    yRange: () => {
      return yRange
    }
  }

  const update = (chart) => {
    xRange = chart.extent()
      .map(point => point[0])
    yRange = chart.extent()
      .map(point => point[1])
  }

  self.subscribe('size', update)
  self.subscribe('padding', update)

  return self
}

export { hasXy }
