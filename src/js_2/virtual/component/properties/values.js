const hasFnValue = (state = {}) => {
  let fnValue = d => d

  const self = {
    ...state,
    fnsValue: () => {
      return [fnValue]
    },
    fnValue: (value) => {
      if (typeof value === 'undefined') return fnValue
      fnValue = value
    }
  }

  return self
}

const hasFnLowHighValue = (state = {}) => {
  let fnLowValue = d => 0
  let fnHighValue = d => d

  const self = {
    ...state,
    fnsValue: () => {
      return [fnLowValue, fnHighValue]
    },
    fnLowValue: (value) => {
      if (typeof value === 'undefined') return fnLowValue
      fnLowValue = value
    },
    fnHighValue: (value) => {
      if (typeof value === 'undefined') return fnHighValue
      fnHighValue = value
    }
  }

  return self
}

export { hasFnValue, hasFnLowHighValue }
