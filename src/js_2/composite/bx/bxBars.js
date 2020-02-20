
import pipe from 'lodash/fp/flow'
import component from '../../virtual/component/base/index'

import { componentProxy } from '../../common'
import { hasBars } from '../../virtual/component/composite/bars'
import { hasMultiDraw } from '../../virtual/component/properties/draw'

const bxBars = (state = {}) => {
  const self = pipe(
    component,
    hasBars,
    hasMultiDraw
  )(state)

  self.fnBefore(s =>
    s.attr('x', self.fnBand())
      .attr('width', self.bandwidth())
      .attr('y', self.fnLow())
      .attr('height', 0)
      .attr('opacity', 0)
  )

  self.fnNow(s =>
    s.attr('x', self.fnBand())
      .attr('width', self.bandwidth())
      .attr('y', self.fnHigh())
      .attr('height', (d, i) => self.fnLow()(d, i) - self.fnHigh()(d, i))
      .attr('opacity', 1) // not needed
  )

  self.fnAfter(s =>
    s.attr('y', self.fnLow())
      .attr('height', 0)
      .attr('opacity', 0)
  )

  return componentProxy(self)
}

export default bxBars
