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
    const fnBandScale = chart.fnBandScale() // to reduce overhead
    fnBandOut = (d, i) => fnBandScale(chart.fnBandValue()(d, i))
    fnBandCenterOut = (d, i) =>
      fnBandScale(chart.fnBandValue()(d, i)) + fnBandScale.bandwidth() / 2
    bandwidthOut = fnBandScale.bandwidth()

    fnBandLeftOut = (d, i) => Math.max(
      fnBandScale.range()[0],
      fnBandOut(d, i) - fnBandScale.step() * fnBandScale.paddingInner() / 2
    )
    fnBandRightOut = (d, i) => Math.min(
      fnBandOut(d, i) + bandwidthOut + fnBandScale.step() * fnBandScale.paddingInner() / 2,
      fnBandScale.range()[1]
    )
  }

  self.subscribe('draw', updateOuts)

  return self
}

export { hasBandOut }
