import pipe from 'lodash/fp/flow'

import { chartProxy } from '../../common'
import chart from '../../virtual/chart/base/index'
import { hasXy } from '../../virtual/chart/types/xy'
import { hasDoubleContScaleFactory } from '../../virtual/chart/properties/scales'

const xyChart = (state = {}) => {
  const self = pipe(
    chart,
    hasXy,
    hasDoubleContScaleFactory(['x', 'y'])
  )(state)

  return chartProxy(self)
}

export default xyChart
