import pipe from 'lodash/fp/flow'

import { chartProxy } from '../../common'
import chart from '../../virtual/chart/base/index'

const baseChart = (state = {}) => {
  const self = pipe(
    chart
  )(state)

  self.publish('data', self)
  self.publish('size', self)

  return chartProxy(self)
}

export default baseChart
