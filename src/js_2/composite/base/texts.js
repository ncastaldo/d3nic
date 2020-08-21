
import pipe from 'lodash/fp/flow'
import component from '../../virtual/component/base/index'

import { componentProxy } from '../../common'
import { hasText } from '../../virtual/component/types/text'
import { hasTransform } from '../../virtual/component/properties/transform'
import { hasMultiDrawFactory } from '../../virtual/component/properties/draw'

const paths = (state = {}) => {
  const self = pipe(
    component,
    hasText,
    hasTransform,
    hasMultiDrawFactory('text')
  )(state)

  self.fnBefore(s =>
    s.attr('opacity', 0)
      .attr('transform', self.fnTransform())
      .text(self.fnText())
  )

  self.fnNow(s =>
    s.attr('transform', self.fnTransform())
      .text(self.fnText())
  )

  self.fnAfter(s => s.attr('opacity', 0))

  return componentProxy(self)
}

export default paths
