const hasCircle = (state = {}) => {
  let xCenter = (d, i) => 10
  let yCenter = (d, i) => 10
  let radius = (d, i) => 5

  const self = {
    ...state,
    xCenter (value) {
      if (typeof value === 'undefined') return xCenter
      xCenter = value
    },
    yCenter (value) {
      if (typeof value === 'undefined') return yCenter
      yCenter = value
    },
    radius (value) {
      if (typeof value === 'undefined') return radius
      radius = value
    }
  }

  return self
}

export { hasCircle }
