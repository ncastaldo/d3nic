import pipe from 'lodash/fp/flow'

import { chartProxy } from '../../common'
import chart from '../../virtual/chart/base/index'
import { hasBandScaleFactory, hasContScaleFactory } from '../../virtual/chart/properties/scales'

const bxChart = (state = {}) => {
  const self = pipe(
    chart,
    hasBandScaleFactory('x'),
    hasContScaleFactory('y')
  )(state)

  self.publish('data', self)
  self.publish('size', self)

  return chartProxy(self)
}

export default bxChart
