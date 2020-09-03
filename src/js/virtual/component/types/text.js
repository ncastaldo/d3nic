const hasText = (state = {}) => {
  let text = (d, i) => d
  let fontSize = 10

  let textPadding = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  }

  const self = {
    ...state,
    text (value) {
      if (typeof value === 'undefined') return text
      text = value
    },
    fontSize (value) {
      if (typeof value === 'undefined') return fontSize
      fontSize = value
    },
    textPadding (value) {
      if (typeof value === 'undefined') return textPadding
      textPadding = { ...textPadding, ...value }
    }
  }

  return self
}

export { hasText }
