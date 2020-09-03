
import pipe from 'lodash/fp/flow'
import component from '../../virtual/component/base/index'

import { getProxy } from '../../virtual/common/proxy'
import { hasCircle } from '../../virtual/component/types/circle'
import { hasDoubleBandOut } from '../../virtual/component/outs/doubleBand'
import { hasMultiDrawFactory } from '../../virtual/component/properties/draw'

const bbCircles = (state = {}) => {
  const self = pipe(
    component,
    hasCircle,
    hasDoubleBandOut,
    hasMultiDrawFactory('circle')
  )(state)

  self.fnBefore(s =>
    s.attr('cx', self.fnDoubleBandCenterOut()(0))
      .attr('cy', self.fnDoubleBandCenterOut()(1))
      .attr('r', 0)
      .attr('opacity', 0)
  )

  self.fnNow(s =>
    s.attr('cx', self.fnDoubleBandCenterOut()(0))
      .attr('cy', self.fnDoubleBandCenterOut()(1))
      .attr('r', self.radius()) // parametrize
  )

  self.fnAfter(s =>
    s.attr('r', 0)
      .attr('opacity', 0)
  )

  return getProxy(self)
}

export default bbCircles
