
import pipe from 'lodash/fp/flow'

import { hasValue } from '../properties/values'

const hasDoubleContOut = (state = {}) => {
  let fnDoubleContOut

  const self = {
    ...state,
    ...pipe(
      hasValue
    )(state),
    fnDoubleContOut (value) {
      if (typeof value === 'undefined') return fnDoubleContOut
      fnDoubleContOut = value
    }
  }

  const updateOuts = (chart) => {
    const fnDoubleContScales = [...Array(2)].map((_, k) => chart.fnDoubleContScale()(k)) // to reduce overhead

    fnDoubleContOut = k =>
      typeof self.value() === 'function'
        ? (d, i) => fnDoubleContScales[k](self.value()(d, i)[k]) // value must return an array [val1, val2]
        : () => fnDoubleContScales[k](self.value()[k])
  }

  self.subscribe('draw', updateOuts)

  return self
}

const hasRangeDoubleContOut = (state = {}) => {
  let rangeDoubleContOut

  const self = {
    ...state,
    rangeDoubleContOut () {
      return rangeDoubleContOut
    }
  }

  const updateOuts = (chart) => {
    rangeDoubleContOut = k => chart.fnDoubleContScale()(k).range()
  }

  self.subscribe('draw', updateOuts)

  return self
}

export { hasDoubleContOut, hasRangeDoubleContOut }
