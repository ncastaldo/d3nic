import pipe from 'lodash/fp/flow'
import component from '../../virtual/component/base/index'

import { componentProxy } from '../../common'
import { hasDoubleContAxisFactory } from '../../virtual/component/types/axis'
import { hasSingleFunctionDraw } from '../../virtual/component/properties/draw'

const xyAxisX = (state = {}) => {
  const self = pipe(
    component,
    hasDoubleContAxisFactory('x', 0),
    hasSingleFunctionDraw
  )(state)

  self.fnBefore(s =>
    s.attr('transform', self.translateAxis())
      .call(self.fnAxis())
      .attr('opacity', 0)
  )

  self.fnNow(s =>
    s.attr('transform', self.translateAxis())
      .call(self.fnAxis())
      .attr('opacity', 1)
  )

  self.fnAfter(s =>
    s.attr('opacity', 0)
  )

  return componentProxy(self)
}

export default xyAxisX
