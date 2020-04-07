import pipe from 'lodash/fp/flow'

import { chartProxy } from '../../common'
import chart from '../../virtual/chart/base/index'
import { hasXy } from '../../virtual/chart/types/xy'
import { hasBandScaleFactory, hasContScaleFactory } from '../../virtual/chart/properties/scales'

const bxChart = (state = {}) => {
  const self = pipe(
    chart,
    hasXy,
    hasBandScaleFactory('x'),
    hasContScaleFactory('y')
  )(state)

  return chartProxy(self)
}

export default bxChart
