import pipe from 'lodash/fp/flow'

import { chartProxy } from '../../common'
import hasChart from '../../base/chart'
import { hasBandX, hasContY } from './bxScales'

const bxChart = (state = {}) => {
  const self = pipe(
    hasChart,
    hasBandX,
    hasContY
  )(state)

  self.publish('data', self)
  self.publish('size', self)

  return chartProxy(self)
}

export default bxChart
