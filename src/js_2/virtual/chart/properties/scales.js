import {
  scaleBand,
  scaleLinear,
  scalePow,
  scaleSqrt,
  scaleLog,
  scaleSymlog,
  scaleRadial,
  scaleTime
} from 'd3-scale'

const contScales = {
  scaleLinear,
  scalePow,
  scaleSqrt,
  scaleLog,
  scaleSymlog,
  scaleRadial,
  scaleTime
}

const computeRange = (chart, on, type) => {
  const range = on === 'x'
    ? chart.xRange()
    : on === 'y'
      ? chart.yRange()
      : on === 'angle' // angle
        ? chart.angleRange()
        : on === 'radius'
          ? chart.radiusRange()
          : [0, 1]

  return range.sort((a, b) =>
    on === 'y' && type !== 'band'
      ? b - a
      : a - b
  )
}

const hasBandScaleFactory = (on = 'x') => (state = {}) => {
  let fnBandValue = (d, i) => i

  let paddingInner = 0
  let paddingOuter = 0
  let bandScaleDomain = null
  let bandScaleRange = null

  const self = {
    ...state,
    fnBandValue: (value) => {
      if (typeof value === 'undefined') return fnBandValue
      fnBandValue = value
    },
    paddingInner: (value) => {
      if (typeof value === 'undefined') return paddingInner
      paddingInner = value
    },
    paddingOuter: (value) => {
      if (typeof value === 'undefined') return paddingOuter
      paddingOuter = value
    },
    fnBandScale: () => {
      return scaleBand()
        .paddingInner(paddingInner)
        .paddingOuter(paddingOuter)
        .domain(bandScaleDomain)
        .range(bandScaleRange)
    }
  }

  const updateScaleDomain = (chart) => {
    bandScaleDomain = chart.data().map(fnBandValue)
  }

  const updateScaleRange = (chart) => {
    bandScaleRange = computeRange(chart, on, 'band')
  }

  self.subscribe('data', updateScaleDomain)
  self.subscribe('components', updateScaleDomain)
  self.subscribe('size', updateScaleRange)
  self.subscribe('padding', updateScaleRange)

  return self
}

const hasContScaleFactory = (on) => (state = {}) => {
  let contScaleDomain = null
  let contScaleRange = null

  let contScaleType = Object.keys(contScales)[0] // scaleLinear

  let baseContDomain = [Infinity, -Infinity]

  const getContScaleType = (maybe) => {
    return maybe in contScales
      ? maybe
      : contScaleType // previous one
  }

  const self = {
    ...state,
    contScaleType: (value) => {
      if (typeof value === 'undefined') return contScaleType
      contScaleType = getContScaleType(value)
    },
    baseContDomain: (value) => {
      if (typeof value === 'undefined') return baseContDomain
      baseContDomain = value
    },
    fnContScale: () => {
      return contScales[contScaleType]()
        .domain(contScaleDomain)
        .range(contScaleRange)
    }
  }

  const computeContDomain = (chart) => {
    const componentProperties = chart.components()
      .filter(c => 'fnsValue' in c)
      .map(c => ({
        fnsValue: c.fnsValue(),
        fnDefined: c.fnDefined()
      }))

    return chart.data()
      .reduce((domain, d, i) => {
        const fnsValue = componentProperties
          .filter(prop => prop.fnDefined(d, i))
          .map(prop => prop.fnsValue)
          .flat()
        return [
          Math.min(domain[0], ...fnsValue.map(fn => fn(d, i))),
          Math.max(domain[1], ...fnsValue.map(fn => fn(d, i)))
        ]
      }, baseContDomain)
  }

  const updateScaleDomain = (chart) => {
    contScaleDomain = computeContDomain(chart)
  }

  const updateScaleRange = (chart) => {
    contScaleRange = computeRange(chart, on, 'cont')
  }

  self.subscribe('data', updateScaleDomain)
  self.subscribe('components', updateScaleDomain)
  self.subscribe('size', updateScaleRange)
  self.subscribe('padding', updateScaleRange)

  return self
}

export {
  hasBandScaleFactory,
  hasContScaleFactory
}
