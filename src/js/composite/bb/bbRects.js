
import pipe from 'lodash/fp/flow'
import component from '../../virtual/component/base/index'

import { select } from 'd3-selection'

import { componentProxy } from '../../common'
import { hasDoubleBandOut } from '../../virtual/component/outs/doubleBand'
import { hasMultiDrawFactory } from '../../virtual/component/properties/draw'

const bbRects = (state = {}) => {
  const self = pipe(
    component,
    hasDoubleBandOut,
    hasMultiDrawFactory('rect')
  )(state)

  self.fnBefore(s =>
    s.attr('x', self.fnDoubleBandCenterOut()(0))
      .attr('width', 0)
      .attr('y', self.fnDoubleBandCenterOut()(1))
      .attr('height', 0)
      .attr('opacity', 0)
  )

  self.fnNow(s =>
    s.attr('x', self.fnDoubleBandOut()(0))
      .attr('width', self.doubleBandwidthOut()(0))
      .attr('y', self.fnDoubleBandOut()(1))
      .attr('height', self.doubleBandwidthOut()(1))
  )

  self.fnAfter(s =>
    s.attr('x', (d, i, nodes) => +select(nodes[i]).attr('x') + +select(nodes[i]).attr('width') / 2)
      .attr('width', 0)
      .attr('y', (d, i, nodes) => +select(nodes[i]).attr('y') + +select(nodes[i]).attr('height') / 2)
      .attr('height', 0)
      .attr('opacity', 0)
  )

  return componentProxy(self)
}

export default bbRects
