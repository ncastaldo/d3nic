
import pipe from 'lodash/fp/flow'
import component from '../../virtual/component/base/index'

import { componentProxy } from '../../common'
import { hasBandBars } from '../../virtual/component/composite/bandBars'
import { hasMultiDrawFactory } from '../../virtual/component/properties/draw'

const byBars = (state = {}) => {
  const self = pipe(
    component,
    hasBandBars,
    hasMultiDrawFactory('rect')
  )(state)

  self.fnBefore(s =>
    s.attr('x', self.fnLow())
      .attr('width', 0)
      .attr('y', self.fnBand())
      .attr('height', self.bandwidth())
      .attr('opacity', 0)
  )

  self.fnNow(s =>
    s.attr('x', self.fnLow())
      .attr('width', self.fnHigh())
      .attr('y', self.fnBand())
      .attr('height', self.bandwidth())
      // .attr('opacity', 1) // not needed
  )

  self.fnAfter(s =>
    s.attr('width', 0)
      .attr('opacity', 0)
  )

  return componentProxy(self)
}

export default byBars
