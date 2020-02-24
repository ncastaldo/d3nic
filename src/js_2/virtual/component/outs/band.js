const hasBandOut = (state = {}) => {
  let fnBandOut
  let fnBandCenterOut
  let bandwidthOut
  let fnBandLeftOut
  let fnBandRightOut

  const self = {
    ...state,
    fnBandOut: () => {
      return fnBandOut
    },
    fnBandCenterOut: () => {
      return fnBandCenterOut
    },
    bandwidthOut: () => {
      return bandwidthOut
    },
    fnBandLeftOut: () => {
      return fnBandLeftOut
    },
    fnBandRightOut: () => {
      return fnBandRightOut
    }
  }

  const updateOuts = (chart) => {
    fnBandOut = (d, i) => chart.fnBandScale()(chart.fnBandValue()(d, i))
    fnBandCenterOut = (d, i) =>
      chart.fnBandScale()(chart.fnBandValue()(d, i)) + chart.fnBandScale().bandwidth() / 2
    bandwidthOut = chart.fnBandScale().bandwidth()

    fnBandLeftOut = (d, i) => Math.max(
      chart.fnBandScale().range()[0],
      fnBandOut(d, i) - chart.fnBandScale().step() * chart.fnBandScale().paddingInner() / 2
    )
    fnBandRightOut = (d, i) => Math.min(
      fnBandOut(d, i) + bandwidthOut + chart.fnBandScale().step() * chart.fnBandScale().paddingInner() / 2,
      chart.fnBandScale().range()[1]
    )
  }

  self.subscribe('draw', updateOuts)

  return self
}

export { hasBandOut }
