import pipe from 'lodash/fp/flow'

import { getProxy } from '../../virtual/common/proxy'
import _chart from '../../virtual/chart/base/index'

const chart = (state = {}) => {
  const self = pipe(
    _chart
  )(state)

  return getProxy(self)
}

export default chart
