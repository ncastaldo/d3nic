import pipe from 'lodash/fp/flow'

import { getProxy } from '../../virtual/common/proxy'
import chart from '../../virtual/chart/base/index'
import { hasXy } from '../../virtual/chart/types/xy'
import { hasBandScaleFactory, hasContScaleFactory } from '../../virtual/chart/properties/scales'

const bxChart = (state = {}) => {
  const self = pipe(
    chart,
    hasXy,
    hasBandScaleFactory('y'),
    hasContScaleFactory('x')
  )(state)

  return getProxy(self)
}

export default bxChart
