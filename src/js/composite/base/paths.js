
import pipe from 'lodash/fp/flow'
import component from '../../virtual/component/base/index'

import { getProxy } from '../../virtual/common/proxy'
import { hasPath } from '../../virtual/component/types/path'
import { hasTransform } from '../../virtual/component/properties/transform'
import { hasMultiDrawFactory } from '../../virtual/component/properties/draw'

const paths = (state = {}) => {
  const self = pipe(
    component,
    hasPath,
    hasTransform,
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

  return getProxy(self)
}

export default paths
