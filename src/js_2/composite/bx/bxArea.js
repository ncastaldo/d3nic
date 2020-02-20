
import pipe from 'lodash/fp/flow'
import * as d3 from '@/js/d3-modules.js'

import component from '../../virtual/component/base/index'

import { componentProxy } from '../../common'
import { hasSingleDrawFactory } from '../../virtual/component/properties/draw'
import { hasBandLines } from '../../virtual/component/composite/bandLines'

const bxArea = (state = {}) => {
  const self = pipe(
    component,
    hasBandLines,
    hasSingleDrawFactory('path')
  )(state)

  self.fnBefore(s =>
    s.attr('d',
      d3.area()
        .x(self.fnBandCenter())
        .y0(self.fnLow())
        .y1(self.fnLow()))
      .attr('opacity', 0)

  )

  self.fnNow(s =>
    s.attr('d',
      d3.area()
        .x(self.fnBandCenter())
        .y0(self.fnLow())
        .y1(self.fnHigh()))
  )

  self.fnAfter(s =>
    s.attr('opacity', 0)
  )

  return componentProxy(self)
}

export default bxArea
