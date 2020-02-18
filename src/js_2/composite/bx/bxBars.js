
import pipe from 'lodash/fp/flow'
import hasComponent from '../../base/component'
import hasBars from '../../virtual/components/bars'
import { componentProxy } from '../../common'

const bxBars = (state = {}) => {
  const self = pipe(
    hasComponent,
    hasBars
  )(state)

  const fnDraw = (fnDraw, chart) => {
    const x = (d, i) => chart.fnBandXScale()(chart.fnBandValue()(d, i))
    const width = chart.fnBandXScale().bandwidth()

    const yBefore = (d, i) => chart.fnContYScale()(self.fnLowValue()(d, i))
    const y = (d, i) => chart.fnContYScale()(self.fnHighValue()(d, i))
    const yAfter = yBefore

    const heightBefore = 0
    const height = (d, i) => yBefore(d, i) - y(d, i)
    const heightAfter = heightBefore

    const join = fnDraw.join(
      enter => enter
        .append('rect')
        .call(self.fnStyle)
        .attr('x', x)
        .attr('width', width)
        .attr('y', yBefore)
        .attr('height', heightBefore)
        .attr('opacity', 0)
        .call(enter => enter
          .transition(chart.transition())
          .attr('y', y)
          .attr('height', height)
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
          .attr('y', yAfter)
          .attr('height', heightAfter)
          .attr('opacity', 0))
    )
    self.join(join)
  }

  const draw = (chart) => {
    self.group()
      .classed('bxBars', true)
      .selectAll('rect')
      .data(chart.data(), chart.fnKey())
      .call(fnDraw, chart)
  }

  self.subscribe('draw', draw)

  return componentProxy(self)
}

export default bxBars
