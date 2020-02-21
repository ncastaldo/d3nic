
import pipe from 'lodash/fp/flow'
import component from '../../virtual/component/base/index'

import { componentProxy } from '../../common'
import { hasBandOut } from '../../virtual/component/outs/band'
import { hasLowHighContOut } from '../../virtual/component/outs/cont'
import { hasMultiDrawFactory } from '../../virtual/component/properties/draw'

const bxBars = (state = {}) => {
  const self = pipe(
    component,
    hasBandOut,
    hasLowHighContOut,
    hasMultiDrawFactory('rect')
  )(state)

  self.fnBefore(s =>
    s.attr('x', self.fnBandOut())
      .attr('width', self.bandwidthOut())
      .attr('y', self.fnLowContOut())
      .attr('height', 0)
      .attr('opacity', 0)
  )

  self.fnNow(s =>
    s.attr('x', self.fnBandOut())
      .attr('width', self.bandwidthOut())
      .attr('y', self.fnHighContOut())
      .attr('height', (d, i) => self.fnLowContOut()(d, i) - self.fnHighContOut()(d, i))
      // .attr('opacity', 1) // not needed
  )

  self.fnAfter(s =>
    s.attr('y', self.fnLowContOut())
      .attr('height', 0)
      .attr('opacity', 0)
  )

  return componentProxy(self)
}

export default bxBars
