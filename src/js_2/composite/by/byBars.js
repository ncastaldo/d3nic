
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
      .attr('opacity', 1) // not needed
  )

  self.fnAfter(s =>
    s.attr('width', 0)
      .attr('opacity', 0)
  )

  return componentProxy(self)
}

export default bxBars
