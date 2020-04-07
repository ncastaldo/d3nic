import { interpolate } from 'd3-interpolate'
import { arc } from 'd3-shape'

const hasPolar = (state = {}) => {
  const fnArcTween = (from, to) => {
    const fnInterpolate = interpolate(from, to)
    return t => arc()(fnInterpolate(t))
  }

  const self = {
    ...state,
    fnArcTween: () => {
      return fnArcTween
    }
  }

  return self
}

export { hasPolar }
