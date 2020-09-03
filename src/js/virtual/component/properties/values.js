import pipe from 'lodash/fp/flow'

const hasDefined = (state = {}) => {
  let defined = d => true

  const self = {
    ...state,
    defined (value) {
      if (typeof value === 'undefined') return defined
      defined = value
    }
  }

  return self
}

const hasValue = (state = {}) => {
  let value = d => d

  const self = {
    ...state,
    ...pipe(
      hasDefined
    )(state),
    values () {
      return [value]
    },
    value (_value) {
      if (typeof _value === 'undefined') return value
      value = _value
    }
  }

  return self
}

const hasLowHighValue = (state = {}) => {
  let lowValue = 0 // function or not
  let highValue = d => d

  const self = {
    ...state,
    ...pipe(
      hasDefined
    )(state),
    values () {
      return [lowValue, highValue]
    },
    lowValue (value) {
      if (typeof value === 'undefined') return lowValue
      lowValue = value
    },
    highValue (value) {
      if (typeof value === 'undefined') return highValue
      highValue = value
    }
  }

  return self
}

export { hasValue, hasLowHighValue }
