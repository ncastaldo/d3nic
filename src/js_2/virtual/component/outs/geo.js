import * as d3 from '@/js/d3-modules.js'
import pipe from 'lodash/fp/flow'

import { hasValue } from '../properties/values'

const hasGeoOut = (state = {}) => {
  let fnGeoOut

  const self = {
    ...state,
    ...pipe(
      hasValue
    )(state),
    fnGeoOut: (value) => {
      if (typeof value === 'undefined') return fnGeoOut
      fnGeoOut = value
    }
  }

  const updateOuts = (chart) => {
    const geoPath = d3.geoPath(chart.fnGeoProjection())
    fnGeoOut = (d, i) => geoPath(self.fnValue()(d, i))
  }

  self.subscribe('draw', updateOuts)

  return self
}

export { hasGeoOut }
