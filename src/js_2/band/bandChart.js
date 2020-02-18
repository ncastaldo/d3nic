import * as d3 from '@/js/d3-modules.js'

import { chartProxy } from '../common'
import chart from '../base/chart'

const bandChart = () => {
  const fnBandScale = d3.scaleBand()
  const fnContScale = d3.scaleLinear()

  let fnBandValue = (_, i) => i

  let horizontal = false

  let bandDomain = [0, 1]
  let bandRange = [0, 1]

  let contBaseDomain = [Infinity, -Infinity]

  let contDomain = [0, 1]
  let contRange = [0, 1]

  const self = {
    ...chart(),
    horizontal: (value) => {
      if (typeof value === 'undefined') return horizontal
      horizontal = value
    },
    fnBandValue: (value) => {
      if (typeof value === 'undefined') return fnBandValue
      fnBandValue = value
    },
    contBaseDomain: (value) => {
      if (typeof value === 'undefined') return contBaseDomain
      contBaseDomain = value
    },
    fnBandScale: () => {
      return fnBandScale
    },
    fnContScale: () => {
      return fnContScale
    }
  }

  const updateBandDomain = (chart) => {
    bandDomain = chart.data().map(fnBandValue)
    fnBandScale.domain(bandDomain)
  }

  const updateBxRange = (chart) => {
    bandRange = chart.extent().map(point => point[horizontal ? 1 : 0])
    fnBandScale.range(bandRange)
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
      , contBaseDomain)
    fnContScale.domain(contDomain)
  }

  const updateYRange = (chart) => {
    contRange = chart.extent().map(point => point[horizontal ? 0 : 1])// .sort((a, b) => b - a)
    console.log(chart.extent(), contRange)
    fnContScale.range(contRange)
  }

  updateBandDomain(self)
  updateContDomain(self)
  updateBxRange(self)
  updateYRange(self)

  self.subscribe('data', updateBandDomain, updateContDomain)
  self.subscribe('components', updateBandDomain, updateContDomain)

  self.subscribe('size', updateBxRange, updateYRange)
  self.subscribe('padding', updateBxRange, updateYRange)

  return chartProxy(self)
}

export default bandChart
