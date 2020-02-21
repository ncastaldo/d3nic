import pipe from 'lodash/fp/flow'
import * as d3 from '@/js/d3-modules.js'

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
    hasMultiDrawFactory('line')
  )(state)

  self.fnBefore(s =>
    s.attr('x1', self.fnBandCenterOut())
      .attr('y1', self.fnLowContOut())
      .attr('x2', self.fnBandCenterOut())
      .attr('y2', self.fnLowContOut())
      .attr('opacity', 0)
  )

  self.fnNow(s =>
    s.attr('x1', self.fnBandCenterOut())
      .attr('y1', self.fnLowContOut())
      .attr('x2', self.fnBandCenterOut())
      .attr('y2', self.fnHighContOut())
      // .attr('opacity', 1) // not needed
  )

  self.fnAfter(s =>
    s.attr('y2', (d, i, nodes) => d3.select(nodes[i]).attr('y1'))
      .attr('opacity', 0)
  )

  return componentProxy(self)
}

export default bxBars
