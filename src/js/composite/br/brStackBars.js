
import pipe from 'lodash/fp/flow'
import component from '../../virtual/component/base/index'

import { getProxy } from '../../virtual/common/proxy'
import { hasPolar } from '../../virtual/component/types/polar'
import { hasStackBandOut } from '../../virtual/component/outs/band'
import { hasLowHighContOut } from '../../virtual/component/outs/cont'
import { hasMultiDrawFactory } from '../../virtual/component/properties/draw'

const brStackBars = (state = {}) => {
  const self = pipe(
    component,
    hasPolar,
    hasStackBandOut,
    hasLowHighContOut,
    hasMultiDrawFactory('path')
  )(state)

  self.fnBefore(s =>
    s.each((d, i, nodes) => {
      nodes[i].beforeArc = {
        startAngle: self.fnLowContOut()(d, i),
        endAngle: self.fnLowContOut()(d, i),
        innerRadius: self.stackBandExtentOut()[0],
        outerRadius: self.stackBandExtentOut()[1]
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
        innerRadius: self.stackBandExtentOut()[0],
        outerRadius: self.stackBandExtentOut()[1]
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

  return getProxy(self)
}

export default brStackBars
