
import pipe from 'lodash/fp/flow'
import component from '../../virtual/component/base/index'

import { componentProxy } from '../../common'
import { hasCircle } from '../../virtual/component/types/circle'
import { hasDoubleContOut } from '../../virtual/component/outs/doubleCont'
import { hasMultiDrawFactory } from '../../virtual/component/properties/draw'

const xyCircles = (state = {}) => {
  const self = pipe(
    component,
    hasCircle,
    hasDoubleContOut,
    hasMultiDrawFactory('circle')
  )(state)

  self.fnBefore(s =>
    s.attr('cx', self.fnDoubleContOut()(0))
      .attr('cy', self.fnDoubleContOut()(1))
      .attr('r', 0)
      .attr('opacity', 0)
  )

  self.fnNow(s =>
    s.attr('cx', self.fnDoubleContOut()(0))
      .attr('cy', self.fnDoubleContOut()(1))
      .attr('r', self.fnRadius()) // parametrize
  )

  self.fnAfter(s =>
    s.attr('r', 0)
      .attr('opacity', 0)
  )

  return componentProxy(self)
}

export default xyCircles
