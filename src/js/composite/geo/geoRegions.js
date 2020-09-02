
import pipe from 'lodash/fp/flow'
import component from '../../virtual/component/base/index'

import { getProxy } from '../../virtual/common/proxy'
import { hasGeoOut } from '../../virtual/component/outs/geo'
import { hasMultiDrawFactory } from '../../virtual/component/properties/draw'

const geoRegions = (state = {}) => {
  const self = pipe(
    component,
    hasGeoOut,
    hasMultiDrawFactory('path')
  )(state)

  self.fnBefore(s =>
    s.attr('d', self.fnGeoOut())
      .attr('opacity', 0)
  )

  self.fnNow(s =>
    s.attr('d', self.fnGeoOut())
  )

  self.fnAfter(s =>
    s.attr('opacity', 0)
  )

  return getProxy(self)
}

export default geoRegions
