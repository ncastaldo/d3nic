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

  let contBaseDomain = [Infinity, -Infinity]
  let contFixedDomain = null

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
    contBaseDomain: (value) => {
      if (typeof value === 'undefined') return contBaseDomain
      contBaseDomain = value
    },
    contFixedDomain: (value) => {
      if (typeof value === 'undefined') return contFixedDomain
      contFixedDomain = value
    },
    fnContScale: () => {
      return contScales[contScaleType]()
        .domain(contFixedDomain || contScaleDomain)
        .range(contScaleRange)
        .clamp(contFixedDomain !== null)
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
        const values = fnsValue.map(fn => fn(d, i))
        return [
          Math.min(domain[0], ...values),
          Math.max(domain[1], ...values)
        ]
      }, contBaseDomain)
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

const hasDoubleContScaleFactory = (on = ['x', 'y']) => (state = {}) => {
  let doubleContScaleDomain = Array(2).fill(null)
  let doubleContScaleRange = Array(2).fill(null)

  const doubleContScaleType = Array(2).fill(Object.keys(contScales)[0]) // scaleLinear

  const doubleContBaseDomain = Array(2).fill([Infinity, -Infinity])
  const doubleContFixedDomain = Array(2).fill(null)

  const getContScaleType = (maybe, index) => {
    return maybe in contScales
      ? maybe : doubleContScaleType[index] // previous one
  }

  const self = {
    ...state,
    doubleContScaleType: (value, index) => {
      if (typeof value === 'undefined') return k => doubleContScaleType[k]
      doubleContScaleType[index] = getContScaleType(value, index)
    },
    doubleContBaseDomain: (value, index) => {
      if (typeof value === 'undefined') return k => doubleContBaseDomain[k]
      doubleContBaseDomain[index] = value
    },
    doubleContFixedDomain: (value, index) => {
      if (typeof value === 'undefined') return k => doubleContFixedDomain[k]
      doubleContFixedDomain[index] = value
    },
    fnDoubleContScale: () => {
      return k => contScales[doubleContScaleType[k]]()
        .domain(doubleContFixedDomain[k] || doubleContScaleDomain[k])
        .range(doubleContScaleRange[k])
        .clamp(doubleContFixedDomain[k] !== null)
    }
  }

  const computeDoubleContDomain = (chart) => {
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
        const values = fnsValue.map(fn => fn(d, i))
        return [
          [
            Math.min(domain[0][0], ...values.map(v => v[0])),
            Math.max(domain[0][1], ...values.map(v => v[0]))
          ],
          [
            Math.min(domain[1][0], ...values.map(v => v[1])),
            Math.max(domain[1][1], ...values.map(v => v[1]))
          ]
        ]
      }, doubleContBaseDomain)
  }

  const updateScaleDomain = (chart) => {
    doubleContScaleDomain = computeDoubleContDomain(chart)
  }

  const updateScaleRange = (chart) => {
    doubleContScaleRange = [...Array(2)].map((_, k) => computeRange(chart, on[k], 'cont'))
  }

  self.subscribe('data', updateScaleDomain)
  self.subscribe('components', updateScaleDomain)
  self.subscribe('size', updateScaleRange)
  self.subscribe('padding', updateScaleRange)

  return self
}

export {
  hasBandScaleFactory,
  hasContScaleFactory,
  hasDoubleContScaleFactory
}
