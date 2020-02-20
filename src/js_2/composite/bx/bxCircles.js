
import pipe from 'lodash/fp/flow'
import component from '../../virtual/component/base/index'

import { componentProxy } from '../../common'
import { hasBandPoints } from '../../virtual/component/composite/bandPoints'
import { hasMultiDrawFactory } from '../../virtual/component/properties/draw'

const bxBars = (state = {}) => {
  const self = pipe(
    component,
    hasBandPoints,
    hasMultiDrawFactory('circle')
  )(state)

  self.fnBefore(s =>
    s.attr('cx', self.fnBandCenter())
      .attr('cy', self.fn())
      .attr('r', 0)
      .attr('opacity', 0)
  )

  self.fnNow(s =>
    s.attr('cx', self.fnBandCenter())
      .attr('cy', self.fn())
      .attr('r', 5) // parametrize
  )

  self.fnAfter(s =>
    s.attr('r', 0)
      .attr('opacity', 0)
  )

  return componentProxy(self)
}

export default bxBars
