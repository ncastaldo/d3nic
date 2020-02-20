import * as d3 from '@/js/d3-modules.js'
import pipe from 'lodash/fp/flow'

import { hasFnValue } from '../properties/values'

const hasGeoPaths = (state = {}) => {
  let fn

  const self = {
    ...state,
    ...pipe(
      hasFnValue
    )(state),
    fn: (value) => {
      if (typeof value === 'undefined') return fn
      fn = value
    }
  }

  const updateFn = (chart) => {
    const geoPath = d3.geoPath(chart.fnGeoProjection())
    fn = (d, i) => geoPath(self.fnValue()(d, i))
  }

  self.subscribe('draw', updateFn)

  return self
}

export { hasGeoPaths }
