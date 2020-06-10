
import pipe from 'lodash/fp/flow'
import component from '../../virtual/component/base/index'

import { componentProxy } from '../../common'
import { hasPolar } from '../../virtual/component/types/polar'
import { hasBandOut } from '../../virtual/component/outs/band'
import { hasRangeContOut } from '../../virtual/component/outs/cont'
import { hasMultiDrawFactory } from '../../virtual/component/properties/draw'

const bxBars = (state = {}) => {
  const self = pipe(
    component,
    hasPolar,
    hasBandOut,
    hasRangeContOut,
    hasMultiDrawFactory('path')
  )(state)

  self.fnOpacity(0)

  self.fnNow(s =>
    s.each((d, i, nodes) => {
      nodes[i].fromArc = {
        startAngle: self.fnBandLeftOut()(d, i),
        endAngle: self.fnBandRightOut()(d, i),
        innerRadius: self.rangeContOut()[0],
        outerRadius: self.rangeContOut()[1]
      }
      nodes[i].toArc = { ...nodes[i].fromArc }
    })
      .attrTween('d', self.fnArcTween())
  )

  return componentProxy(self)
}

export default bxBars
