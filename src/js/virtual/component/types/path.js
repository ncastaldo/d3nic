const hasPath = (state = {}) => {
  let path = (d, i) => null

  const self = {
    ...state,
    path (value) {
      if (typeof value === 'undefined') return path
      path = value
    }
  }

  return self
}

export { hasPath }
