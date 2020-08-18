
import pipe from 'lodash/fp/flow'
import component from '../../virtual/component/base/index'

import { componentProxy } from '../../common'
import { hasText } from '../../virtual/component/types/text'
import { hasDoubleContOut } from '../../virtual/component/outs/doubleCont'
import { hasMultiDrawFactory } from '../../virtual/component/properties/draw'

const xyTexts = (state = {}) => {
  const self = pipe(
    component,
    hasText,
    hasDoubleContOut,
    hasMultiDrawFactory('text')
  )(state)

  self.fnBefore(s =>
    s.attr('x', self.fnDoubleContOut()(0))
      .attr('y', self.fnDoubleContOut()(1))
      .text(self.fnText())
      .attr('opacity', 0)
  )

  self.fnNow(s =>
    s.attr('x', self.fnDoubleContOut()(0))
      .attr('y', self.fnDoubleContOut()(1))
      .text(self.fnText())
  )

  self.fnAfter(s =>
    s.attr('opacity', 0)
  )

  return componentProxy(self)
}

export default xyTexts
