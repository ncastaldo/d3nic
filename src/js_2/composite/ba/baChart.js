import pipe from 'lodash/fp/flow'

import { chartProxy } from '../../common'
import chart from '../../virtual/chart/base/index'
import hasPolar from '../../virtual/chart/properties/polar'
import { hasBandScaleFactory, hasContScaleFactory } from '../../virtual/chart/properties/scales'

const baChart = (state = {}) => {
  const self = pipe(
    chart,
    hasBandScaleFactory('r'),
    hasContScaleFactory('a'),
    hasPolar
  )(state)

  self.publish('data', self)
  self.publish('size', self)

  return chartProxy(self)
}

export default baChart
