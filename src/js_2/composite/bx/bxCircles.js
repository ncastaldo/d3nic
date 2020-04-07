
import pipe from 'lodash/fp/flow'
import component from '../../virtual/component/base/index'

import { componentProxy } from '../../common'
import { hasCircle } from '../../virtual/component/types/circle'
import { hasBandOut } from '../../virtual/component/outs/band'
import { hasContOut } from '../../virtual/component/outs/cont'
import { hasMultiDrawFactory } from '../../virtual/component/properties/draw'

const bxBars = (state = {}) => {
  const self = pipe(
    component,
    hasCircle,
    hasBandOut,
    hasContOut,
    hasMultiDrawFactory('circle')
  )(state)

  self.fnBefore(s =>
    s.attr('cx', self.fnBandCenterOut())
      .attr('cy', self.fnContOut())
      .attr('r', 0)
      .attr('opacity', 0)
  )

  self.fnNow(s =>
    s.attr('cx', self.fnBandCenterOut())
      .attr('cy', self.fnContOut())
      .attr('r', self.fnRadius()) // parametrize
  )

  self.fnAfter(s =>
    s.attr('r', 0)
      .attr('opacity', 0)
  )

  return componentProxy(self)
}

export default bxBars
