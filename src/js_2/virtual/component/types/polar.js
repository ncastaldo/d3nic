import { interpolate } from 'd3-interpolate'
import { arc } from 'd3-shape'

const hasPolar = (state = {}) => {
  let radius = 1

  const fnArcTween = (from, to) => {
    const fnInterpolate = interpolate(from, to)
    return t => arc()(fnInterpolate(t))
  }

  const self = {
    ...state,
    radius: () => {
      return radius
    },
    fnArcTween: () => {
      return fnArcTween
    }
  }

  const updateRadius = (chart) => {
    radius = chart.radius()
  }

  self.subscribe('data', updateRadius)
  self.subscribe('components', updateRadius)

  return self
}

export { hasPolar }
