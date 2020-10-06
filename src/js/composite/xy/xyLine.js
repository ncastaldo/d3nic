
import pipe from 'lodash/fp/flow'
import { line } from 'd3-shape'

import component from '../../virtual/component/base/index'

import { getProxy } from '../../virtual/common/proxy'
import { hasDoubleContOut } from '../../virtual/component/outs/doubleCont'
import { hasSingleDrawFactory } from '../../virtual/component/properties/draw'

const xyLine = (state = {}) => {
  const self = pipe(
    component,
    hasDoubleContOut,
    hasSingleDrawFactory('path')
  )(state)

  self.fnBefore(s =>
    s.attr('d',
      line()
        .defined(self.fnDefined())
        .x(self.fnDoubleContOut()(0))
        .y(self.fnDoubleContOut()(1)))
      .attr('opacity', 0)

  )

  self.fnNow(s =>
    s.attr('d',
      line()
        .defined(self.fnDefined())
        .x(self.fnDoubleContOut()(0))
        .y(self.fnDoubleContOut()(1)))
  )

  self.fnAfter(s =>
    s.attr('opacity', 0)
  )

  return getProxy(self)
}

export default xyLine
