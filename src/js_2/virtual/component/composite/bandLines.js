
import pipe from 'lodash/fp/flow'

import { hasFnLowHighValue } from '../properties/values'

const hasBandLines = (state = {}) => {
  let fnBandCenter

  let fnHigh
  let fnLow

  const self = {
    ...state,
    ...pipe(
      hasFnLowHighValue
    )(state),
    fnBandCenter: (value) => {
      if (typeof value === 'undefined') return fnBandCenter
      fnBandCenter = value
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
    fnBandCenter = (d, i) =>
      chart.fnBandScale()(chart.fnBandValue()(d, i)) + chart.fnBandScale().bandwidth() / 2

    fnLow = (d, i) => chart.fnContScale()(self.fnLowValue()(d, i))
    fnHigh = (d, i) => chart.fnContScale()(self.fnHighValue()(d, i))
  }

  self.subscribe('draw', updateFns)

  return self
}

export { hasBandLines }
