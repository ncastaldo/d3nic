import * as d3 from '@/js/d3-modules.js'
import pipe from 'lodash/fp/flow'

import { hasBand, hasCont } from '../../virtual/properties/domain'
import { hasX, hasY } from '../../virtual/properties/range'

const hasBandY = (state = {}) => {
  const fnBandYScale = d3.scaleBand()

  const self = {
    ...state,
    ...pipe(
      hasBand,
      hasY
    )(state),
    fnBandYScale: () => {
      return fnBandYScale
    }
  }

  const updateScaleDomain = (chart) => {
    fnBandYScale.domain(self.bandDomain())
  }

  const updateScaleRange = (chart) => {
    fnBandYScale.range(self.yRange())
  }

  self.subscribe('data', updateScaleDomain)
  self.subscribe('components', updateScaleDomain)

  self.subscribe('size', updateScaleRange)
  self.subscribe('padding', updateScaleRange)

  return self
}

const hasContX = (state = {}) => {
  const fnContXScale = d3.scaleLinear() // parametrize

  const self = {
    ...state,
    ...pipe(
      hasCont,
      hasX
    )(state),
    fnContXScale: () => {
      return fnContXScale
    }
  }

  const updateScaleDomain = (chart) => {
    fnContXScale.domain(self.contDomain())
  }

  const updateScaleRange = (chart) => {
    fnContXScale.range(self.xRange())
  }

  self.subscribe('data', updateScaleDomain)
  self.subscribe('components', updateScaleDomain)

  self.subscribe('size', updateScaleRange)
  self.subscribe('padding', updateScaleRange)

  return self
}

export { hasBandY, hasContX }
