const hasCircle = (state = {}) => {
  let fnCenterX = (d, i) => 10
  let fnCenterY = (d, i) => 10
  let fnRadius = (d, i) => 5

  const self = {
    ...state,
    fnCenterX: (value) => {
      if (typeof value === 'undefined') return fnCenterX
      fnCenterX = value
    },
    fnCenterY: (value) => {
      if (typeof value === 'undefined') return fnCenterY
      fnCenterY = value
    },
    fnRadius: (value) => {
      if (typeof value === 'undefined') return fnRadius
      fnRadius = value
    }
  }

  return self
}

export { hasCircle }
