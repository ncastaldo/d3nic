const hasText = (state = {}) => {
  let fnText = (d, i) => d

  const self = {
    ...state,
    fnText: (value) => {
      if (typeof value === 'undefined') return fnText
      fnText = value
    }
  }

  return self
}

export { hasText }
