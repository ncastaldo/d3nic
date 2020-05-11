import pipe from 'lodash/fp/flow'
import component from '../../virtual/component/base/index'

import { componentProxy } from '../../common'
import { hasBandBrushFactory } from '../../virtual/component/types/brush'
import { hasBandOut } from '../../virtual/component/outs/band'
import { hasSingleFunctionDraw } from '../../virtual/component/properties/draw'

const bxBrush = (state = {}) => {
  const self = pipe(
    component,
    hasBandOut,
    hasBandBrushFactory('x'),
    hasSingleFunctionDraw
  )(state)

  // self.fnBefore(s => s.call(self.fnBrush()))

  self.fnNow(s =>
    s.attr('opacity', 1)
      .call(t => t.selection().call(self.fnBrush()))
      .call(self.fnBrush().move, self.bandBrushRange())
  )

  return componentProxy(self)
}

export default bxBrush
