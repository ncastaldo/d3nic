
import pipe from 'lodash/fp/flow'

import { hasValue, hasLowHighValue } from '../properties/values'

const hasContOut = (state = {}) => {
  let fnContOut

  const self = {
    ...state,
    ...pipe(
      hasValue
    )(state),
    fnContOut (value) {
      if (typeof value === 'undefined') return fnContOut
      fnContOut = value
    }
  }

  const updateOuts = (chart) => {
    const fnContScale = chart.fnContScale() // to reduce overhead
    fnContOut = typeof self.fnValue() === 'function'
      ? (d, i) => fnContScale(self.fnValue()(d, i))
      : () => fnContScale(self.fnValue())
  }

  self.subscribe('draw', updateOuts)

  return self
}

const hasLowHighContOut = (state = {}) => {
  let fnLowContOut
  let fnHighContOut

  const self = {
    ...state,
    ...pipe(
      hasLowHighValue
    )(state),
    fnLowContOut (value) {
      if (typeof value === 'undefined') return fnLowContOut
      fnLowContOut = value
    },
    fnHighContOut (value) {
      if (typeof value === 'undefined') return fnHighContOut
      fnHighContOut = value
    }
  }

  const updateOuts = (chart) => {
    const fnContScale = chart.fnContScale()
    fnLowContOut = typeof self.fnLowValue() === 'function'
      ? (d, i) => fnContScale(self.fnLowValue()(d, i))
      : () => fnContScale(self.fnLowValue())

    fnHighContOut = typeof self.fnHighValue() === 'function'
      ? (d, i) => fnContScale(self.fnHighValue()(d, i))
      : () => fnContScale(self.fnHighValue())
  }

  self.subscribe('draw', updateOuts)

  return self
}

const hasRangeContOut = (state = {}) => {
  let rangeContOut

  const self = {
    ...state,
    rangeContOut () {
      return rangeContOut
    }
  }

  const updateOuts = (chart) => {
    rangeContOut = chart.fnContScale().range()
  }

  self.subscribe('draw', updateOuts)

  return self
}

export { hasContOut, hasLowHighContOut, hasRangeContOut }
