
import pipe from 'lodash/fp/flow'
import component from '../../virtual/component/base/index'

import { componentProxy } from '../../common'
import { hasGeoPaths } from '../../virtual/component/composite/geoPaths'
import { hasMultiDrawFactory } from '../../virtual/component/properties/draw'

const geoRegions = (state = {}) => {
  const self = pipe(
    component,
    hasGeoPaths,
    hasMultiDrawFactory('path')
  )(state)

  self.fnBefore(s =>
    s.attr('d', self.fn())
      .attr('opacity', 0)
  )

  self.fnNow(s =>
    s.attr('d', self.fn())
  )

  self.fnAfter(s =>
    s.attr('opacity', 0)
  )

  return componentProxy(self)
}

export default geoRegions
