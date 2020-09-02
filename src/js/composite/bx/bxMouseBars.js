
import pipe from 'lodash/fp/flow'
import component from '../../virtual/component/base/index'

import { componentProxy } from '../../common'
import { hasBandOut } from '../../virtual/component/outs/band'
import { hasRangeContOut } from '../../virtual/component/outs/cont'
import { hasMultiDrawFactory } from '../../virtual/component/properties/draw'

const bxBars = (state = {}) => {
  const self = pipe(
    component,
    hasBandOut,
    hasRangeContOut,
    hasMultiDrawFactory('rect')
  )(state)

  self.fnOpacity(0)

  self.fnNow(s =>
    s.attr('x', self.fnBandLeftOut())
      .attr('width', (d, i) => self.fnBandRightOut()(d, i) - self.fnBandLeftOut()(d, i))
      .attr('y', self.rangeContOut()[1])
      .attr('height', Math.abs(self.rangeContOut()[1] - self.rangeContOut()[0]))
  )

  return componentProxy(self)
}

export default bxBars
