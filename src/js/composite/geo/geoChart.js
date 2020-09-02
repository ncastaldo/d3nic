import pipe from 'lodash/fp/flow'

import { getProxy } from '../../virtual/common/proxy'
import chart from '../../virtual/chart/base/index'
import { hasGeoProjection } from '../../virtual/chart/properties/projection'

const geoChart = (state = {}) => {
  const self = pipe(
    chart,
    hasGeoProjection
  )(state)

  return getProxy(self)
}

export default geoChart
