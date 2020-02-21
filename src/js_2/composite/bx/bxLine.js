
import pipe from 'lodash/fp/flow'
import * as d3 from '@/js/d3-modules.js'

import component from '../../virtual/component/base/index'

import { componentProxy } from '../../common'
import { hasBandOut } from '../../virtual/component/outs/band'
import { hasContOut } from '../../virtual/component/outs/cont'
import { hasSingleDrawFactory } from '../../virtual/component/properties/draw'

const bxLine = (state = {}) => {
  const self = pipe(
    component,
    hasBandOut,
    hasContOut,
    hasSingleDrawFactory('path')
  )(state)

  self.fnBefore(s =>
    s.attr('d',
      d3.line()
        .x(self.fnBandCenterOut())
        .y(self.fnContOut()))
      .attr('opacity', 0)

  )

  self.fnNow(s =>
    s.attr('d',
      d3.line()
        .x(self.fnBandCenterOut())
        .y(self.fnContOut())
    )
  )

  self.fnAfter(s =>
    s.attr('opacity', 0)
  )

  return componentProxy(self)
}

export default bxLine
