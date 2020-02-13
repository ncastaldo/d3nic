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

import { chartProxy } from '../common'
import chart from '../base/chart'

const bxChart = () => {
  let fnBxScale// = d3.scaleBand()
  let fnYScale // = d3.scaleLinear()

  let bxDomain

  let yBaseDomain = [NaN, NaN]

  const yDomain = [0, 1]
  const yRange = [0, 1]

  const self = {
    ...chart(),
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
    bxDomain = chart.component()
      .map(component => component.fnBxDomain(chart.data())) // implement function
      .reduce((accDomain, curDomain) =>
        [
          Math.min(accDomain[0], curDomain[0]),
          Math.max(accDomain[1], curDomain[1])
        ]
      , [])
  }

  const updateYDomain = (chart, bxDomain) => {
    return chart.component()
      .map(component => component.bxDomain(chart.data())) // implement function
      .reduce((accDomain, curDomain) =>
        [
          Math.min(accDomain[0], curDomain[0]),
          Math.max(accDomain[1], curDomain[1])
        ]
      , [])
  }

  self.subscribe('data', updateBxDomain)
  self.subscribe('data', updateBxDomain)

  return chartProxy(self)
}

export default bxChart
