const hasBandOut = (state = {}) => {
  let fnBandOut
  let fnBandCenterOut
  let bandwidthOut
  let fnBandLeftOut
  let fnBandRightOut

  let bandExtentOut

  const self = {
    ...state,
    fnBandOut () {
      return fnBandOut
    },
    fnBandCenterOut () {
      return fnBandCenterOut
    },
    bandwidthOut () {
      return bandwidthOut
    },
    fnBandLeftOut () {
      return fnBandLeftOut
    },
    fnBandRightOut () {
      return fnBandRightOut
    },
    bandExtentOut () {
      return bandExtentOut
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

    const dom = fnBandScale.domain()
    const len = dom.length

    bandExtentOut = len
      ? [fnBandOut(dom[0], 0), fnBandOut(dom[len - 1], len - 1) + bandwidthOut]
      : fnBandScale.range()
  }

  // cannot update only on draw, because brush may need it
  self.subscribe('components', 'data', 'graphics', updateOuts)

  return self
}

const hasStackBandOut = (state = {}) => {
  let stackBandExtentOut

  const self = {
    ...state,
    stackBandExtentOut () {
      return stackBandExtentOut
    }
  }

  const updateOuts = (chart) => {
    const fnBandScale = chart.fnBandScale() // to reduce overhead

    const range = fnBandScale.range()
    const rLen = range[1] - range[0]

    stackBandExtentOut = [
      range[0] + rLen * fnBandScale.paddingInner(), // inner is now left
      range[1] - rLen * fnBandScale.paddingOuter()
    ]
  }

  self.subscribe('components', 'data', 'graphics', updateOuts)

  return self
}

export { hasBandOut, hasStackBandOut }
