
import pipe from 'lodash/fp/flow'

import { hasFnLowHighValue } from '../properties/values'

const hasBars = (state = {}) => {
  let fnBand
  let bandwidth

  let fnHigh
  let fnLow

  const self = {
    ...state,
    ...pipe(
      hasFnLowHighValue
    )(state),
    fnBand: (value) => {
      if (typeof value === 'undefined') return fnBand
      fnBand = value
    },
    bandwidth: (value) => {
      if (typeof value === 'undefined') return bandwidth
      bandwidth = value
    },
    fnHigh: (value) => {
      if (typeof value === 'undefined') return fnHigh
      fnHigh = value
    },
    fnLow: (value) => {
      if (typeof value === 'undefined') return fnLow
      fnLow = value
    }
  }

  const updateFns = (chart) => {
    fnBand = (d, i) => chart.fnBandScale()(chart.fnBandValue()(d, i))
    bandwidth = chart.fnBandScale().bandwidth()

    fnLow = (d, i) => chart.fnContScale()(self.fnLowValue()(d, i))
    fnHigh = (d, i) => chart.fnContScale()(self.fnHighValue()(d, i))
  }

  self.subscribe('draw', updateFns)

  return self
}

export { hasBars }
