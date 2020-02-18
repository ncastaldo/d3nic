import * as d3 from '@/js/d3-modules.js'

import { chartProxy, hasRegistry } from '../common'
import chart from '../base/chart'

const hasCont = () => {
  let contDomain = [0, 1]
  let baseContDomain = [Infinity, -Infinity]

  const self = {
    ...hasRegistry(),
    baseContDomain: (value) => {
      if (typeof value === 'undefined') return baseContDomain
      baseContDomain = value
    },
    contDomain: () => {
      return contDomain
    }
  }

  const updateContDomain = (chart) => {
    contDomain = chart.components()
      .filter(c => 'contDomain' in c)
      .map(c => c.publish('computeContDomain', chart))
      .map(c => c.contDomain())
      .reduce((accDomain, curDomain) =>
        [
          Math.min(accDomain[0], curDomain[0]),
          Math.max(accDomain[1], curDomain[1])
        ]
      , baseContDomain)
  }

  self.subscribe('data', updateContDomain)
  self.subscribe('components', updateContDomain)

  return self
}

const hasBand = () => {
  let fnBandValue = (_, i) => i
  let bandDomain = [0, 1]

  const self = {
    ...hasRegistry(),
    fnBandValue: (value) => {
      if (typeof value === 'undefined') return fnBandValue
      fnBandValue = value
    },
    bandDomain: () => {
      return bandDomain
    }
  }

  // review
  const updateBandDomain = (chart) => {
    bandDomain = chart.data().map(fnBandValue)
  }

  self.subscribe('data', updateBandDomain)
  self.subscribe('components', updateBandDomain)

  return self
}

const hasX = () => {
  let xRange = [0, 1]

  const self = {
    ...hasRegistry(),
    xRange: () => {
      return xRange
    }
  }

  const updateXRange = (chart) => {
    xRange = chart.extent().map(point => point[0])
  }

  self.subscribe('size', updateXRange)
  self.subscribe('padding', updateXRange)

  return self
}

const hasY = () => {
  let yRange = [0, 1]

  const self = {
    ...hasRegistry(),
    yRange: () => {
      return yRange
    }
  }

  const updateYRange = (chart) => {
    yRange = chart.extent().map(point => point[1]).sort((a, b) => b - a)
  }

  self.subscribe('size', updateYRange)
  self.subscribe('padding', updateYRange)

  return self
}

const hasBandX = () => {
  const fnBandXScale = d3.scaleBand()

  const self = {
    ...hasBand(),
    ...hasX(),
    fnBandXScale: () => {
      return fnBandXScale
    }
  }

  const updateScaleDomain = (chart) => {
    fnBandXScale.domain(self.bandDomain())
  }

  const updateScaleRange = (chart) => {
    fnBandXScale.range(self.xRange())
  }

  self.subscribe('data', updateScaleDomain)
  self.subscribe('components', updateScaleDomain)

  self.subscribe('size', updateScaleRange)
  self.subscribe('padding', updateScaleRange)

  return self
}

const hasContY = () => {
  const fnContYScale = d3.scaleLinear() // parametrize

  const self = {
    ...hasCont(),
    ...hasY(),
    fnContYScale: () => {
      return fnContYScale
    }
  }

  const updateScaleDomain = (chart) => {
    fnContYScale.domain(self.contDomain())
  }

  const updateScaleRange = (chart) => {
    fnContYScale.range(self.yRange())
  }

  self.subscribe('data', updateScaleDomain)
  self.subscribe('components', updateScaleDomain)

  self.subscribe('size', updateScaleRange)
  self.subscribe('padding', updateScaleRange)

  return self
}

const bxChart = () => {
  const self = {
    ...chart(),
    ...hasBandX(),
    ...hasContY()
  }

  self.publish('data', self)
  self.publish('size', self)

  return chartProxy(self)
}

export default bxChart
