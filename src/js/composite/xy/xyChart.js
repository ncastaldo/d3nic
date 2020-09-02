import pipe from 'lodash/fp/flow'

import { getProxy } from '../../virtual/common/proxy'
import chart from '../../virtual/chart/base/index'
import { hasXy } from '../../virtual/chart/types/xy'
import { hasDoubleContScaleFactory } from '../../virtual/chart/properties/scales'

const xyChart = (state = {}) => {
  const self = pipe(
    chart,
    hasXy,
    hasDoubleContScaleFactory(['x', 'y'])
  )(state)

  return getProxy(self)
}

export default xyChart
