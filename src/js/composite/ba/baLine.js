
import pipe from 'lodash/fp/flow'
import { lineRadial, curveLinearClosed } from 'd3-shape'

import component from '../../virtual/component/base/index'

import { hasPolar } from '../../virtual/component/types/polar'
import { hasBandOut } from '../../virtual/component/outs/band'
import { hasContOut } from '../../virtual/component/outs/cont'
import { hasSingleDrawFactory } from '../../virtual/component/properties/draw'

import { getProxy } from '../../virtual/common/proxy'

const baLine = (state = {}) => {
  const self = pipe(
    component,
    hasPolar,
    hasBandOut,
    hasContOut,
    hasSingleDrawFactory('path')
  )(state)

  self.fnBefore(s =>
    s.attr('d',
      lineRadial()
        .defined(self.fnDefined())
        .angle(self.fnBandCenterOut())
        .radius(self.fnContOut())
        .curve(curveLinearClosed))
      .attr('opacity', 0)

  )

  self.fnNow(s =>
    s.attr('d',
      lineRadial()
        .defined(self.fnDefined())
        .angle(self.fnBandCenterOut())
        .radius(self.fnContOut())
        .curve(curveLinearClosed))
  )

  self.fnAfter(s =>
    s.attr('opacity', 0)
  )

  return getProxy(self)
}

export default baLine
