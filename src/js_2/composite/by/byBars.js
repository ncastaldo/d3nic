
import pipe from 'lodash/fp/flow'
import component from '../../virtual/component/base/index'

import { componentProxy } from '../../common'
import { hasBandOut } from '../../virtual/component/outs/band'
import { hasLowHighContOut } from '../../virtual/component/outs/cont'
import { hasMultiDrawFactory } from '../../virtual/component/properties/draw'

const byBars = (state = {}) => {
  const self = pipe(
    component,
    hasBandOut,
    hasLowHighContOut,
    hasMultiDrawFactory('rect')
  )(state)

  self.fnBefore(s =>
    s.attr('x', self.fnLowContOut())
      .attr('width', 0)
      .attr('y', self.fnBandOut())
      .attr('height', self.bandwidthOut())
      .attr('opacity', 0)
  )

  self.fnNow(s =>
    s.attr('x', self.fnLowContOut())
      .attr('width', self.fnHighContOut())
      .attr('y', self.fnBandOut())
      .attr('height', self.bandwidthOut())
      // .attr('opacity', 1) // not needed
  )

  self.fnAfter(s =>
    s.attr('width', 0)
      .attr('opacity', 0)
  )

  return componentProxy(self)
}

export default byBars
