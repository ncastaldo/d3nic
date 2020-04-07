
import pipe from 'lodash/fp/flow'
import component from '../../virtual/component/base/index'

import { select } from 'd3-selection'

import { componentProxy } from '../../common'
import { hasPolar } from '../../virtual/component/types/polar'
import { hasBandOut } from '../../virtual/component/outs/band'
import { hasLowHighContOut } from '../../virtual/component/outs/cont'
import { hasMultiDrawFactory } from '../../virtual/component/properties/draw'

const baBars = (state = {}) => {
  const self = pipe(
    component,
    hasPolar,
    hasBandOut,
    hasLowHighContOut,
    hasMultiDrawFactory('path')
  )(state)

  self.fnBefore(s =>
    s.attr('transform', 'translate(111, 111)')
      .each((d, i, nodes) => {
        nodes[i].beforeArc = {
          startAngle: self.fnBandOut()(d, i),
          endAngle: self.fnBandRightOut()(d, i),
          innerRadius: self.fnLowContOut()(d, i),
          outerRadius: self.fnLowContOut()(d, i)
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
        startAngle: self.fnBandOut()(d, i),
        endAngle: self.fnBandRightOut()(d, i),
        innerRadius: self.fnLowContOut()(d, i),
        outerRadius: self.fnHighContOut()(d, i)
      }
    })
      .attrTween('d', (d, i, nodes) =>
        self.fnArcTween()(
          nodes[i].fromArc,
          nodes[i].toArc
        ))

  )

  self.fnAfter(s =>
    s.each((d, i, nodes) => {
      // just to be consistent
      nodes[i].fromArc = { ...nodes[i].toArc }
      nodes[i].toArc = { ...nodes[i].beforeArc }
    })
      .attrTween('d', (d, i, nodes) =>
        self.fnArcTween()(
          nodes[i].fromArc,
          nodes[i].toArc
        ))
      .attr('opacity', 0)
  )

  return componentProxy(self)
}

export default baBars
