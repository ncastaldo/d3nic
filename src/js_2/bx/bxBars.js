
import component from '../base/component'
import { componentProxy } from '../common'

const bxBars = () => {
  let fnBottomValue = d => 0
  let fnTopValue = d => d

  let yDomain = [0, 1]

  const self = {
    ...component(),
    fnBottomValue: (value) => {
      if (typeof value === 'undefined') return fnBottomValue
      fnBottomValue = value
    },
    fnTopValue: (value) => {
      if (typeof value === 'undefined') return fnTopValue
      fnTopValue = value
    },
    yDomain: () => {
      return yDomain
    }
  }

  const fnDraw = (fnDraw, chart) => {
    const x = (d, i) => chart.fnBxScale()(chart.fnBxValue()(d, i))
    const width = chart.fnBxScale().bandwidth()

    const yBefore = (d, i) => chart.fnYScale()(fnBottomValue(d, i))
    const y = (d, i) => chart.fnYScale()(fnTopValue(d, i))
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

  const computeYDomain = (chart) => {
    yDomain = chart.data()
      .reduce((domain, d, i) =>
        [
          Math.min(domain[0], Math.min(fnBottomValue(d, i), fnTopValue(d, i))),
          Math.max(domain[1], Math.max(fnBottomValue(d, i), fnTopValue(d, i)))
        ]
      , [Infinity, -Infinity])
  }
  self.subscribe('computeYDomain', computeYDomain)

  return componentProxy(self)
}

export default bxBars
