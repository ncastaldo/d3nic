const hasCircle = (state = {}) => {
  let fnRadius = (d, i) => 5

  const self = {
    ...state,
    fnRadius: (value) => {
      if (typeof value === 'undefined') return fnRadius
      fnRadius = value
    }
  }

  return self
}

export { hasCircle }
