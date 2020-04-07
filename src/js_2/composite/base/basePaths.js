
import pipe from 'lodash/fp/flow'
import component from '../../virtual/component/base/index'

import { componentProxy } from '../../common'
import { hasPath } from '../../virtual/component/types/path'
import { hasMultiDrawFactory } from '../../virtual/component/properties/draw'

const basePaths = (state = {}) => {
  const self = pipe(
    component,
    hasPath,
    hasMultiDrawFactory('path')
  )(state)

  self.fnBefore(s =>
    s.attr('opacity', 0)
      .attr('d', self.fnPath())
      .attr('transform', self.fnTransform())
  )

  self.fnNow(s =>
    s.attr('d', self.fnPath())
      .attr('transform', self.fnTransform())
  )

  self.fnAfter(s => s.attr('opacity', 0))

  return componentProxy(self)
}

export default basePaths
