const hasPath = (state = {}) => {
  let fnPath = (d, i) => null

  const self = {
    ...state,
    fnPath: (value) => {
      if (typeof value === 'undefined') return fnPath
      fnPath = value
    }
  }

  return self
}

export { hasPath }
