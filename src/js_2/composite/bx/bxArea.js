
import pipe from 'lodash/fp/flow'
import * as d3 from '@/js/d3-modules.js'

import component from '../../virtual/component/base/index'

import { componentProxy } from '../../common'
import { hasBandOut } from '../../virtual/component/outs/band'
import { hasLowHighContOut } from '../../virtual/component/outs/cont'
import { hasSingleDrawFactory } from '../../virtual/component/properties/draw'

const bxArea = (state = {}) => {
  const self = pipe(
    component,
    hasBandOut,
    hasLowHighContOut,
    hasSingleDrawFactory('path')
  )(state)

  self.fnBefore(s =>
    s.attr('d',
      d3.area()
        .x(self.fnBandCenterOut())
        .y0(self.fnLowContOut())
        .y1(self.fnLowContOut()))
      .attr('opacity', 0)

  )

  self.fnNow(s =>
    s.attr('d',
      d3.area()
        .x(self.fnBandCenterOut())
        .y0(self.fnLowContOut())
        .y1(self.fnHighContOut()))
  )

  self.fnAfter(s =>
    s.attr('opacity', 0)
  )

  return componentProxy(self)
}

export default bxArea
