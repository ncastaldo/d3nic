import pipe from 'lodash/fp/flow'

import { chartProxy } from '../../common'
import chart from '../../virtual/chart/base/index'
import { hasGeoProjection } from '../../virtual/chart/properties/geoProjection'

const geoChart = (state = {}) => {
  const self = pipe(
    chart,
    hasGeoProjection
  )(state)

  self.publish('data', self)
  self.publish('size', self)

  return chartProxy(self)
}

export default geoChart
