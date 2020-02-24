import * as d3 from '@/js/d3-modules.js'

const computeRange = (chart, on, type) => {
  const r = chart.extent()
    .map(point => point[on === 'x' ? 0 : 1])
    .sort((a, b) => on === 'y' && type !== 'band' ? b - a : a - b)
  console.log(r)
  return r
}

const hasBandScaleFactory = (on = 'x') => (state = {}) => {
  const fnBandScale = d3.scaleBand().paddingInner(0.5)
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
  const fnContScale = d3.scaleLinear() // parametrize

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
    const fnsValue = chart.components()
      .map(c => 'fnsValue' in c ? c.fnsValue() : [])
      .flat()

    return chart.data()
      .reduce((domain, d, i) =>
        [
          Math.min(domain[0], ...fnsValue.map(fn => fn(d, i))),
          Math.max(domain[1], ...fnsValue.map(fn => fn(d, i)))
        ]
      , baseContDomain)
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
