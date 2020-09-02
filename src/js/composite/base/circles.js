
import pipe from 'lodash/fp/flow'
import component from '../../virtual/component/base/index'

import { componentProxy } from '../../common'
import { hasCircle } from '../../virtual/component/types/circle'
import { hasMultiDrawFactory } from '../../virtual/component/properties/draw'

const paths = (state = {}) => {
  const self = pipe(
    component,
    hasCircle,
    hasMultiDrawFactory('circle')
  )(state)

  self.fnBefore(s =>
    s.attr('opacity', 0)
      .attr('cx', self.fnCenterX())
      .attr('cy', self.fnCenterY())
      .attr('r', 0))

  self.fnNow(s =>
    s.attr('cx', self.fnCenterX())
      .attr('cy', self.fnCenterY())
      .attr('r', self.fnRadius()))

  self.fnAfter(s =>
    s.attr('r', 0)
      .attr('opacity', 0))

  return componentProxy(self)
}

export default paths
