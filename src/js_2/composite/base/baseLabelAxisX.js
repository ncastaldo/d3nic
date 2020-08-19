import pipe from 'lodash/fp/flow'
import component from '../../virtual/component/base/index'

import { mean, max } from 'd3-array'

import { componentProxy } from '../../common'
import { hasText } from '../../virtual/component/types/text'
import { hasAxisFactory } from '../../virtual/component/types/axis'
import { hasSingleDrawFactory } from '../../virtual/component/properties/draw'

const bxAxisX = (state = {}) => {
  const self = pipe(
    component,
    hasText,
    hasAxisFactory('x'), // simple axis, no overhead here
    hasSingleDrawFactory('text')
  )(state)

  const getTranslate = self => {
    const x = mean(self.extent(), v => v[0])
    const y = max(self.extent(), v => v[1]) + self.textPadding().top
    return `translate(${x},${y})`
  }

  self.fnBefore(s => s.attr('transform', getTranslate(self))
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .attr('font-size', self.fnFontSize())
    .text(self.fnText())
    .attr('opacity', 0))

  self.fnNow(s =>
    s.attr('transform', getTranslate(self))
      .text(self.fnText())
      .attr('opacity', 1)
  )

  self.fnAfter(s =>
    s.attr('opacity', 0)
  )

  return componentProxy(self)
}

export default bxAxisX
