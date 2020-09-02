const hasTransform = (state = {}) => {
  let fnTransform = (d, i) => null

  const self = {
    ...state,
    fnTransform (value) {
      if (typeof value === 'undefined') return fnTransform
      fnTransform = value
    }
  }

  return self
}

export { hasTransform }
