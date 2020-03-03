import { scaleBand, scaleLinear } from 'd3-scale'

const computeRange = (chart, on, type) => {
  const r = chart.extent()
    .map(point => point[on === 'x' ? 0 : 1])
    .sort((a, b) => on === 'y' && type !== 'band' ? b - a : a - b)
  return r
}

const hasBandScaleFactory = (on = 'x') => (state = {}) => {
  const fnBandScale = scaleBand().paddingInner(0)
  let fnBandValue = (d, i) => i

  const self = {
    ...state,
    fnBandValue: (value) => {
      if (typeof value === 'undefined') return fnBandValue
      fnBandValue = value
    },
    fnBandScale: () => {
      return fnBandScale
    }
  }

  const updateScaleDomain = (chart) => {
    fnBandScale.domain(chart.data().map(fnBandValue))
  }

  const updateScaleRange = (chart) => {
    fnBandScale.range(computeRange(chart, on, 'band'))
  }

  self.subscribe('data', updateScaleDomain)
  self.subscribe('components', updateScaleDomain)
  self.subscribe('size', updateScaleRange)
  self.subscribe('padding', updateScaleRange)

  return self
}

const hasContScaleFactory = (on) => (state = {}) => {
  const fnContScale = scaleLinear() // parametrize

  let baseContDomain = [Infinity, -Infinity]

  const self = {
    ...state,
    baseContDomain: (value) => {
      if (typeof value === 'undefined') return baseContDomain
      baseContDomain = value
    },
    fnContScale: () => {
      return fnContScale
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
          .filter(prop => prop.fnDefined(d, i) || prop.fnDefined(d, i) === 0)
          .map(prop => prop.fnsValue)
          .flat()
        return [
          Math.min(domain[0], ...fnsValue.map(fn => fn(d, i))),
          Math.max(domain[1], ...fnsValue.map(fn => fn(d, i)))
        ]
      }, baseContDomain)
  }

  const updateScaleDomain = (chart) => {
    fnContScale.domain(computeContDomain(chart))
  }

  const updateScaleRange = (chart) => {
    fnContScale.range(computeRange(chart, on, 'cont'))
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
