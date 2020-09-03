
import pipe from 'lodash/fp/flow'
import { line } from 'd3-shape'

import component from '../../virtual/component/base/index'

import { getProxy } from '../../virtual/common/proxy'
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
      line()
        .defined(self.defined())
        .x(self.fnBandCenterOut())
        .y(self.fnContOut()))
      .attr('opacity', 0)

  )

  self.fnNow(s =>
    s.attr('d',
      line()
        .defined(self.defined())
        .x(self.fnBandCenterOut())
        .y(self.fnContOut())
    )
  )

  self.fnAfter(s =>
    s.attr('opacity', 0)
  )

  return getProxy(self)
}

export default bxLine
