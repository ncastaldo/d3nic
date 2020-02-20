
import pipe from 'lodash/fp/flow'
import * as d3 from '@/js/d3-modules.js'

import component from '../../virtual/component/base/index'

import { componentProxy } from '../../common'
import { hasBandPoints } from '../../virtual/component/composite/bandPoints'
import { hasSingleDrawFactory } from '../../virtual/component/properties/draw'

const bxLine = (state = {}) => {
  const self = pipe(
    component,
    hasBandPoints,
    hasSingleDrawFactory('path')
  )(state)

  self.fnBefore(s =>
    s.attr('d',
      d3.line()
        .x(self.fnBandCenter())
        .y(self.fn()))
      .attr('opacity', 0)

  )

  self.fnNow(s =>
    s.attr('d',
      d3.line()
        .x(self.fnBandCenter())
        .y(self.fn())
    )
  )

  self.fnAfter(s =>
    s.attr('opacity', 0)
  )

  return componentProxy(self)
}

export default bxLine
