const hasPath = (state = {}) => {
  let fnPath = (d, i) => null
  let fnTransform = (d, i) => null

  const self = {
    ...state,
    fnPath: (value) => {
      if (typeof value === 'undefined') return fnPath
      fnPath = value
    },
    fnTransform: (value) => {
      if (typeof value === 'undefined') return fnTransform
      fnTransform = value
    }
  }

  return self
}

export { hasPath }
