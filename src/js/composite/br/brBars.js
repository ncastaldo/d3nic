
import pipe from 'lodash/fp/flow'
import component from '../../virtual/component/base/index'

import { componentProxy } from '../../common'
import { hasPolar } from '../../virtual/component/types/polar'
import { hasBandOut } from '../../virtual/component/outs/band'
import { hasLowHighContOut } from '../../virtual/component/outs/cont'
import { hasMultiDrawFactory } from '../../virtual/component/properties/draw'

const brBars = (state = {}) => {
  const self = pipe(
    component,
    hasPolar,
    hasBandOut,
    hasLowHighContOut,
    hasMultiDrawFactory('path')
  )(state)

  self.fnBefore(s =>
    s.each((d, i, nodes) => {
      nodes[i].beforeArc = {
        startAngle: self.fnLowContOut()(d, i),
        endAngle: self.fnLowContOut()(d, i),
        innerRadius: self.fnBandOut()(d, i),
        outerRadius: self.fnBandRightOut()(d, i)
      }
    })
      .attr('opacity', 0)
  )

  self.fnNow(s =>
    s.each((d, i, nodes) => {
      nodes[i].fromArc = 'toArc' in nodes[i]
        ? { ...nodes[i].toArc }
        : { ...nodes[i].beforeArc }
      nodes[i].toArc = {
        startAngle: self.fnLowContOut()(d, i),
        endAngle: self.fnHighContOut()(d, i),
        innerRadius: self.fnBandOut()(d, i),
        outerRadius: self.fnBandRightOut()(d, i)
      }
    })
      .attrTween('d', self.fnArcTween())

  )

  self.fnAfter(s =>
    s.each((d, i, nodes) => {
      // just to be consistent
      nodes[i].fromArc = { ...nodes[i].toArc }
      nodes[i].toArc = { ...nodes[i].beforeArc }
    })
      .attrTween('d', self.fnArcTween())
      .attr('opacity', 0)
  )

  return componentProxy(self)
}

export default brBars
