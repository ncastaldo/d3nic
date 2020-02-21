
const hasBandOut = (state = {}) => {
  let fnBandOut
  let fnBandCenterOut
  let bandwidthOut

  const self = {
    ...state,
    fnBandOut: (value) => {
      if (typeof value === 'undefined') return fnBandOut
      fnBandOut = value
    },
    fnBandCenterOut: (value) => {
      if (typeof value === 'undefined') return fnBandCenterOut
      fnBandCenterOut = value
    },
    bandwidthOut: (value) => {
      if (typeof value === 'undefined') return bandwidthOut
      bandwidthOut = value
    }
  }

  const updateOuts = (chart) => {
    fnBandOut = (d, i) => chart.fnBandScale()(chart.fnBandValue()(d, i))
    fnBandCenterOut = (d, i) =>
      chart.fnBandScale()(chart.fnBandValue()(d, i)) + chart.fnBandScale().bandwidth() / 2
    bandwidthOut = chart.fnBandScale().bandwidth()
  }

  self.subscribe('draw', updateOuts)

  return self
}

export { hasBandOut }
