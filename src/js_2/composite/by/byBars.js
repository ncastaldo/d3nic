import pipe from 'lodash/fp/flow'
import hasComponent from '../../base/component'
import { hasFnLowHighValue } from '../../virtual/components/values'
import { componentProxy } from '../../common'

const byBars = (state = {}) => {
  const self = pipe(
    hasComponent,
    hasFnLowHighValue
  )(state)

  const fnDraw = (fnDraw, chart) => {
    const xBefore = (d, i) => chart.fnContXScale()(self.fnLowValue()(d, i))
    const x = xBefore
    const xAfter = xBefore

    const widthBefore = 0
    const width = (d, i) => chart.fnContXScale()(self.fnHighValue()(d, i)) - x(d, i)
    const widthAfter = 0

    const y = (d, i) => chart.fnBandYScale()(chart.fnBandValue()(d, i))
    const height = (d, i) => chart.fnBandYScale().bandwidth()

    const join = fnDraw.join(
      enter => enter
        .append('rect')
        .call(self.fnStyle)
        .attr('x', xBefore)
        .attr('width', widthBefore)
        .attr('y', y)
        .attr('height', height)
        .attr('opacity', 0)
        .call(enter => enter
          .transition(chart.transition())
          .attr('x', x)
          .attr('width', width)
          .attr('opacity', 1)),
      update => update
        .call(update =>
          update.transition(chart.transition())
            .call(self.fnStyle)
            .attr('x', x)
            .attr('width', width)
            .attr('y', y)
            .attr('height', height)
        ),
      exit => exit
        .call(exit => exit
          .transition(chart.transition())
          .attr('x', xAfter)
          .attr('width', widthAfter)
          .attr('opacity', 0))
    )
    self.join(join)
  }

  const draw = (chart) => {
    self.group()
      .classed('byBars', true)
      .selectAll('rect')
      .data(chart.data(), chart.fnKey())
      .call(fnDraw, chart)
  }

  self.subscribe('draw', draw)

  return componentProxy(self)
}

export default byBars
