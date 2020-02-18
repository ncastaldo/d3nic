import * as d3 from '@/js/d3-modules.js'
import pipe from 'lodash/fp/flow'

import { hasBand, hasCont } from '../../virtual/properties/domain'
import { hasX, hasY } from '../../virtual/properties/range'

const hasBandX = (state = {}) => {
  const fnBandXScale = d3.scaleBand()

  const self = {
    ...state,
    ...pipe(
      hasBand,
      hasX
    )(state),
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

const hasContY = (state = {}) => {
  const fnContYScale = d3.scaleLinear() // parametrize

  const self = {
    ...state,
    ...pipe(
      hasCont,
      hasY
    )(state),
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

export { hasBandX, hasContY }
