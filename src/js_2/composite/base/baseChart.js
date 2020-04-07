import pipe from 'lodash/fp/flow'

import { chartProxy } from '../../common'
import chart from '../../virtual/chart/base/index'

const baseChart = (state = {}) => {
  const self = pipe(
    chart
  )(state)

  return chartProxy(self)
}

export default baseChart
