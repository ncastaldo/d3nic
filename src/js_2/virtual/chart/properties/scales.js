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

  let bandPaddingInner = 0
  let bandPaddingOuter = 0
  let bandScaleDomain = null
  let bandScaleRange = null

  const self = {
    ...state,
    fnBandValue: (value) => {
      if (typeof value === 'undefined') return fnBandValue
      fnBandValue = value
    },
    bandPaddingInner: (value) => {
      if (typeof value === 'undefined') return bandPaddingInner
      bandPaddingInner = value
    },
    bandPaddingOuter: (value) => {
      if (typeof value === 'undefined') return bandPaddingOuter
      bandPaddingOuter = value
    },
    fnBandScale: () => {
      return scaleBand()
        .paddingInner(bandPaddingInner)
        .paddingOuter(bandPaddingOuter)
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

const hasDoubleBandScaleFactory = (on = ['x', 'y']) => (state = {}) => {
  let fnDoubleBandValue = (d, i) => [i, i]

  let doubleBandPaddingInner = Array(2).fill(0)
  let doubleBandPaddingOuter = Array(2).fill(0)

  let doubleBandScaleDomain = Array(2).fill(null)
  let doubleBandScaleRange = Array(2).fill(null)

  const self = {
    ...state,
    fnDoubleBandValue: (value) => {
      // without index like in the component, returns array
      if (typeof value === 'undefined') return fnDoubleBandValue
      fnDoubleBandValue = value
    },
    doubleBandPaddingInner: (value, index) => {
      if (typeof value === 'undefined') return doubleBandPaddingInner
      if (typeof index === 'undefined') {
        doubleBandPaddingInner = value
      } else {
        doubleBandPaddingInner[index] = value
      }
    },
    doubleBandPaddingOuter: (value, index) => {
      if (typeof value === 'undefined') return doubleBandPaddingOuter
      if (typeof index === 'undefined') {
        doubleBandPaddingOuter = value
      } else {
        doubleBandPaddingOuter[index] = value
      }
    },
    fnDoubleBandScale: () => {
      return k => scaleBand()
        .paddingInner(doubleBandPaddingInner[k])
        .paddingOuter(doubleBandPaddingOuter[k])
        .domain(doubleBandScaleDomain[k])
        .range(doubleBandScaleRange[k])
    }
  }

  const updateScaleDomain = (chart) => {
    doubleBandScaleDomain = chart.data()
      .map(fnDoubleBandValue)
      .reduce(([s0, s1], [d0, d1]) => {
        console.log(chart.data(), d0, d1)
        s0.has(d0) || s0.add(d0)
        s1.has(d1) || s1.add(d1)
        return [s0, s1]
      }, [new Set(), new Set()])
      .map(v => { console.log(v); return v })
      .map(s => Array.from(s))
  }

  const updateScaleRange = (chart) => {
    doubleBandScaleRange = [...Array(2)].map((_, k) => computeRange(chart, on[k], 'band'))
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

  let contBaseDomain = null
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

    const baseDomain = contBaseDomain !== null
      ? contBaseDomain : [Infinity, -Infinity]

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
      }, baseDomain)
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

  let doubleContScaleType = Array(2).fill(Object.keys(contScales)[0]) // scaleLinear

  let doubleContBaseDomain = Array(2).fill([Infinity, -Infinity])
  let doubleContFixedDomain = Array(2).fill(null)

  const getContScaleType = (maybe, index) => {
    return maybe in contScales
      ? maybe : doubleContScaleType[index] // previous one
  }

  const self = {
    ...state,
    doubleContScaleType: (value, index) => {
      if (typeof value === 'undefined') return k => doubleContScaleType[k]
      if (typeof index === 'undefined') {
        doubleContScaleType = value.map(getContScaleType)
      } else {
        doubleContScaleType[index] = getContScaleType(value, index)
      }
    },
    doubleContBaseDomain: (value, index) => {
      if (typeof value === 'undefined') return k => doubleContBaseDomain[k]
      if (typeof index === 'undefined') {
        doubleContBaseDomain = value
      } else {
        doubleContBaseDomain[index] = value
      }
    },
    doubleContFixedDomain: (value, index) => {
      if (typeof value === 'undefined') return k => doubleContFixedDomain[k]
      if (typeof index === 'undefined') {
        doubleContFixedDomain = value
      } else {
        doubleContFixedDomain[index] = value
      }
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

    // TODO create cont base domain
    // like in the other one

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
  hasDoubleBandScaleFactory,
  hasContScaleFactory,
  hasDoubleContScaleFactory
}
