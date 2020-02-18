import pipe from 'lodash/fp/flow'

import { chartProxy } from '../../common'
import hasChart from '../../base/chart'
import { hasBandY, hasContX } from './byScales'

const byChart = (state = {}) => {
  const self = pipe(
    hasChart,
    hasBandY,
    hasContX
  )(state)

  self.publish('data', self)
  self.publish('size', self)

  return chartProxy(self)
}

export default byChart
