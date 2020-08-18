
import pipe from 'lodash/fp/flow'
import component from '../../virtual/component/base/index'

import { componentProxy } from '../../common'
import { hasDoubleBandOut } from '../../virtual/component/outs/band'
import { hasMultiDrawFactory } from '../../virtual/component/properties/draw'

const bbRects = (state = {}) => {
  const self = pipe(
    component,
    hasDoubleBandOut,
    hasMultiDrawFactory('rect')
  )(state)

  self.fnBefore(s =>
    s.attr('cx', self.fnBandCenterOut())
      .attr('cy', self.fnContOut())
      .attr('r', 0)
      .attr('opacity', 0)
  )

  self.fnNow(s =>
    s.attr('cx', self.fnBandCenterOut())
      .attr('cy', self.fnContOut())
      .attr('r', self.fnRadius()) // parametrize
  )

  self.fnAfter(s =>
    s.attr('r', 0)
      .attr('opacity', 0)
  )

  return componentProxy(self)
}

export default bbRects
