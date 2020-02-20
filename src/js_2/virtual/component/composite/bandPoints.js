
import pipe from 'lodash/fp/flow'

import { hasFnValue } from '../properties/values'

const hasBandPoints = (state = {}) => {
  let fnBandCenter
  let fn

  const self = {
    ...state,
    ...pipe(
      hasFnValue
    )(state),
    fnBandCenter: (value) => {
      if (typeof value === 'undefined') return fnBandCenter
      fnBandCenter = value
    },
    fn: (value) => {
      if (typeof value === 'undefined') return fn
      fn = value
    }
  }

  const updateFns = (chart) => {
    fnBandCenter = (d, i) =>
      chart.fnBandScale()(chart.fnBandValue()(d, i)) + chart.fnBandScale().bandwidth() / 2

    fn = (d, i) => chart.fnContScale()(self.fnValue()(d, i))
  }

  self.subscribe('draw', updateFns)

  return self
}

export { hasBandPoints }
