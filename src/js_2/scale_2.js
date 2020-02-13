import * as d3 from '@/js/d3-modules.js'
import { chart } from 'chart_2'

const handler = {
  get: (object, property) => {
    return (value) => {
      if (property in object && typeof object[property] === 'function') {
        if (value) {
          object[property](value)

          // using chart publish and publishing the final object
          // MUST HAVE THE SAME NAME
          object.publish(property, object)

          return new Proxy(object, handler)
        } else {
          return object[property]()
        }
      }
      console.log(`no property ${property} here`)
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

const bxChart = (state) => {
  const fnBxScale = d3.scaleBand()
  const fnYScale = d3.scaleLinear()

  let yBaseDomain = [NaN, NaN]

  const self = {
    ...state,
    ...chart(state),
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
