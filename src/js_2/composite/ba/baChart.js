import pipe from 'lodash/fp/flow'

import { chartProxy } from '../../common'
import chart from '../../virtual/chart/base/index'
import hasPolar from '../../virtual/chart/types/polar'
import { hasBandScaleFactory, hasContScaleFactory } from '../../virtual/chart/properties/scales'

const baChart = (state = {}) => {
  const self = pipe(
    chart,
    hasPolar,
    hasBandScaleFactory('radius'),
    hasContScaleFactory('angle')
  )(state)

  self.publish('data', self)
  self.publish('size', self)

  return chartProxy(self)
}

export default baChart
