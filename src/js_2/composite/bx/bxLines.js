import pipe from 'lodash/fp/flow'
import * as d3 from '@/js/d3-modules.js'

import component from '../../virtual/component/base/index'

import { componentProxy } from '../../common'
import { hasBandLines } from '../../virtual/component/composite/bandLines'
import { hasMultiDrawFactory } from '../../virtual/component/properties/draw'

const bxBars = (state = {}) => {
  const self = pipe(
    component,
    hasBandLines,
    hasMultiDrawFactory('line')
  )(state)

  self.fnBefore(s =>
    s.attr('x1', self.fnBandCenter())
      .attr('y1', self.fnLow())
      .attr('x2', self.fnBandCenter())
      .attr('y2', self.fnLow())
      .attr('opacity', 0)
  )

  self.fnNow(s =>
    s.attr('x1', self.fnBandCenter())
      .attr('y1', self.fnLow())
      .attr('x2', self.fnBandCenter())
      .attr('y2', self.fnHigh())
      // .attr('opacity', 1) // not needed
  )

  self.fnAfter(s =>
    s.attr('y2', (d, i, nodes) => d3.select(nodes[i]).attr('y1'))
      .attr('opacity', 0)
  )

  return componentProxy(self)
}

export default bxBars
