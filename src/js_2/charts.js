import * as d3 from '@/js/d3-modules.js'
import { chart } from '@/js_2/chart'

const handler = {
  get: (chart, fn) => {
    return (...args) => {
      if (fn in chart && typeof chart[fn] === 'function') {
        if (fn === 'draw' || args.length) {
          chart[fn](...args)

          chart.publish(fn, chart)
          chart.components().forEach(c => c.publish(fn, chart))

          return new Proxy(chart, handler)
        } else {
          return chart[fn]()
        }
      }
      console.log(`no function ${fn} here`)
      return undefined
    }
  }
}

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

const bxChart = () => {
  const fnBxScale = d3.scaleBand()
  const fnYScale = d3.scaleLinear()

  let yBaseDomain = [NaN, NaN]

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

  return new Proxy(self, handler)
}

export { bxChart }
