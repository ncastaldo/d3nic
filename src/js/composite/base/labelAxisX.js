import pipe from 'lodash/fp/flow'
import component from '../../virtual/component/base/index'

import { mean, max } from 'd3-array'

import { getProxy } from '../../virtual/common/proxy'
import { hasText } from '../../virtual/component/types/text'
import { hasAxisFactory } from '../../virtual/component/types/axis'
import { hasSingleDrawFactory } from '../../virtual/component/properties/draw'

const labelAxisX = (state = {}) => {
  const self = pipe(
    component,
    hasText,
    hasAxisFactory('x'), // simple axis, no overhead here
    hasSingleDrawFactory('text')
  )(state)

  const getTransform = self => {
    const x = mean(self.extent(), v => v[0])
    const y = max(self.extent(), v => v[1]) + self.textPadding().top
    return `translate(${x},${y})`
  }

  self.fnBefore(s => s.attr('transform', getTransform(self))
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'central')
    .attr('font-size', self.fontSize())
    .text(self.text())
    .attr('opacity', 0))

  self.fnNow(s =>
    s.attr('transform', getTransform(self))
      .text(self.text())
      .attr('opacity', 1)
  )

  self.fnAfter(s =>
    s.attr('opacity', 0)
  )

  return getProxy(self)
}

export default labelAxisX
