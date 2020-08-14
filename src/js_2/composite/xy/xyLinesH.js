
import pipe from 'lodash/fp/flow'
import component from '../../virtual/component/base/index'

import { componentProxy } from '../../common'
import { hasDoubleContOut, hasRangeDoubleContOut } from '../../virtual/component/outs/double'
import { hasMultiDrawFactory } from '../../virtual/component/properties/draw'

const xyLinesH = (state = {}) => {
  const self = pipe(
    component,
    hasDoubleContOut,
    hasRangeDoubleContOut,
    hasMultiDrawFactory('line')
  )(state)

  self.fnBefore(s =>
    s.attr('x1', self.fnDoubleContOut()(0))
      .attr('y1', self.fnDoubleContOut()(1))
      .attr('x2', self.fnDoubleContOut()(0))
      .attr('y2', self.fnDoubleContOut()(1))
      .attr('opacity', 0)
  )

  self.fnNow(s =>
    s.attr('x1', self.rangeDoubleContOut()(0)[0])
      .attr('y1', self.fnDoubleContOut()(1))
      .attr('x2', self.rangeDoubleContOut()(0)[1])
      .attr('y2', self.fnDoubleContOut()(1))
      // .attr('opacity', 1) // not needed
  )

  self.fnAfter(s =>
    s.attr('opacity', 0)
  )

  return componentProxy(self)
}

export default xyLinesH
