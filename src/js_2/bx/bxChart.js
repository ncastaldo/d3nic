/*
const computeDomain = (components, baseDomain, target) => {
  return components
    .map(component => component.domain(target)) // implement function
    .reduce((accDomain, curDomain) =>
      [
        Math.min(accDomain[0], curDomain[0]),
        Math.max(accDomain[1], curDomain[1])
      ]
    , baseDomain)
}
*/
import * as d3 from '@/js/d3-modules.js'

import { chartProxy } from '../common'
import chart from '../base/chart'

const bxChart = () => {
  const fnBxScale = d3.scaleBand()
  const fnYScale = d3.scaleLinear()

  let fnBxValue = (_, i) => i

  let bxDomain = [0, 1]
  let bxRange = [0, 1]

  let yBaseDomain = [Infinity, -Infinity]

  let yDomain = [0, 1]
  let yRange = [0, 1]

  const self = {
    ...chart(),
    fnBxValue: (value) => {
      if (typeof value === 'undefined') return fnBxValue
      fnBxValue = value
    },
    yBaseDomain: (value) => {
      if (typeof value === 'undefined') return yBaseDomain
      yBaseDomain = value
    },
    fnBxScale: () => {
      return fnBxScale
    },
    fnYScale: () => {
      return fnYScale
    }
  }

  const updateBxDomain = (chart) => {
    bxDomain = chart.data().map(fnBxValue)
    fnBxScale.domain(bxDomain)
  }

  const updateBxRange = (chart) => {
    bxRange = chart.extent().map(point => point[0])
    fnBxScale.range(bxRange)
  }

  const updateYDomain = (chart) => {
    yDomain = chart.components()
      .filter(c => 'yDomain' in c)
      .map(c => c.publish('computeYDomain', chart))
      .map(c => c.yDomain())
      .reduce((accDomain, curDomain) =>
        [
          Math.min(accDomain[0], curDomain[0]),
          Math.max(accDomain[1], curDomain[1])
        ]
      , yBaseDomain)
    fnYScale.domain(yDomain)
  }

  const updateYRange = (chart) => {
    yRange = chart.extent().map(point => point[1]).sort((a, b) => b - a)
    fnYScale.range(yRange)
  }

  updateBxDomain(self)
  updateYDomain(self)
  updateBxRange(self)
  updateYRange(self)

  self.subscribe('data', updateBxDomain, updateYDomain)
  self.subscribe('components', updateBxDomain, updateYDomain)

  self.subscribe('size', updateBxRange, updateYRange)
  self.subscribe('padding', updateBxRange, updateYRange)

  return chartProxy(self)
}

export default bxChart
