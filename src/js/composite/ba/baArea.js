
import pipe from 'lodash/fp/flow'
import { areaRadial, curveLinearClosed } from 'd3-shape'

import component from '../../virtual/component/base/index'

import { hasPolar } from '../../virtual/component/types/polar'
import { hasBandOut } from '../../virtual/component/outs/band'
import { hasLowHighContOut } from '../../virtual/component/outs/cont'
import { hasSingleDrawFactory } from '../../virtual/component/properties/draw'

import { componentProxy } from '../../common'

const baLine = (state = {}) => {
  const self = pipe(
    component,
    hasPolar,
    hasBandOut,
    hasLowHighContOut,
    hasSingleDrawFactory('path')
  )(state)

  self.fnBefore(s =>
    s.attr('d',
      areaRadial()
        .defined(self.fnDefined())
        .angle(self.fnBandCenterOut())
        .innerRadius(self.fnLowContOut())
        .outerRadius(self.fnLowContOut())
        .curve(curveLinearClosed))
      .attr('opacity', 0)

  )

  self.fnNow(s =>
    s.attr('d',
      areaRadial()
        .defined(self.fnDefined())
        .angle(self.fnBandCenterOut())
        .innerRadius(self.fnLowContOut())
        .outerRadius(self.fnHighContOut())
        .curve(curveLinearClosed))
  )

  self.fnAfter(s =>
    s.attr('opacity', 0)
  )

  return componentProxy(self)
}

export default baLine
