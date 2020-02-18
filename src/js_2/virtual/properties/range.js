
const hasX = (state = {}) => {
  let xRange = [0, 1]

  const self = {
    ...state,
    xRange: () => {
      return xRange
    }
  }

  const updateXRange = (chart) => {
    xRange = chart.extent().map(point => point[0])
  }

  self.subscribe('size', updateXRange)
  self.subscribe('padding', updateXRange)

  return self
}

const hasY = (state = {}) => {
  let yRange = [0, 1]

  const self = {
    ...state,
    yRange: () => {
      return yRange
    }
  }

  const updateYRange = (chart) => {
    yRange = chart.extent().map(point => point[1]).sort((a, b) => b - a)
  }

  self.subscribe('size', updateYRange)
  self.subscribe('padding', updateYRange)

  return self
}

export { hasX, hasY }
