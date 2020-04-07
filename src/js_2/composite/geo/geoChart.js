import pipe from 'lodash/fp/flow'

import { chartProxy } from '../../common'
import chart from '../../virtual/chart/base/index'
import { hasGeoProjection } from '../../virtual/chart/properties/projection'

const geoChart = (state = {}) => {
  const self = pipe(
    chart,
    hasGeoProjection
  )(state)

  return chartProxy(self)
}

export default geoChart
