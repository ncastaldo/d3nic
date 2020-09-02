import pipe from 'lodash/fp/flow'

import { chartProxy } from '../../common'
import _chart from '../../virtual/chart/base/index'

const chart = (state = {}) => {
  const self = pipe(
    _chart
  )(state)

  return chartProxy(self)
}

export default chart
