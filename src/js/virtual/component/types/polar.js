import { interpolate } from 'd3-interpolate'
import { arc } from 'd3-shape'

// sin goes to x, cos goes to y. then y is inverted
const fnPolar2Cartesian = ({ angle, radius }) =>
  [Math.sin(angle), -Math.cos(angle)].map(d => d * radius)

const getPolarInterpolator = (node) => {
  const { fromPolar, toPolar } = node
  return interpolate(fromPolar, toPolar)
}

const getArcInterpolator = (node) => {
  const { fromArc, toArc } = node
  return interpolate(fromArc, toArc)
}

const hasPolar = (state = {}) => {
  let radiusRange = [0, 1]

  const fnXTween = (_, i, nodes) => {
    const fnInterpolate = getPolarInterpolator(nodes[i])
    return t => fnPolar2Cartesian(fnInterpolate(t))[0]
  }

  const fnYTween = (_, i, nodes) => {
    const fnInterpolate = getPolarInterpolator(nodes[i])
    return t => fnPolar2Cartesian(fnInterpolate(t))[1]
  }

  const fnArcTween = (_, i, nodes) => {
    const fnInterpolate = getArcInterpolator(nodes[i])
    return t => arc()(fnInterpolate(t))
  }

  const self = {
    ...state,
    radiusRange () {
      return radiusRange
    },
    fnXTween () {
      return fnXTween
    },
    fnYTween () {
      return fnYTween
    },
    fnArcTween () {
      return fnArcTween
    }
  }

  const updateRadiusRange = (chart) => {
    radiusRange = chart.radiusRange()
  }

  self.subscribe('data', 'components', 'graphics', updateRadiusRange)

  return self
}

export { hasPolar }
