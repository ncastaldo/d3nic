
import component from '../base/component'
import { componentProxy } from '../common'

const bxBars = () => {
  let fnY0Value = d => d
  let fnY1Value = d => 0

  let yDomain = [0, 1]

  const fnDraw = (fnDraw, chart) => {
    const x = (d, i) => chart.fnBxScale()(chart.fnBxValue()(d, i))
    const width = chart.fnBxScale().bandwidth()

    // helpers
    const y0 = (d, i) => chart.fnYScale()(fnY0Value(d, i))
    const y1 = (d, i) => chart.fnYScale()(fnY1Value(d, i))

    const y = y1
    const height = (d, i) => y0(d, i) - y1(d, i)

    const join = fnDraw.join(
      enter => enter
        .append('rect')
        .attr('x', x)
        .attr('width', width)
        .attr('y', y)
        .attr('height', 0)
        .attr('opacity', 0)
        .call(enter => enter
          .transition(chart.transition())
          .attr('y', height)
          .attr('height', y)
          .attr('opacity', 1)),
      update => update
        .call(update =>
          update.transition(chart.transition())
            .attr('x', (d, i) => chart.fnBxScale()(chart.fnBxValue()(d, i)))
            .attr('width', chart.fnBxScale().bandwidth())
            .attr('y', (d, i) => chart.fnYScale()(fnY0Value(d, i)))
            .attr('height', (d, i) => chart.fnYScale()(fnY1Value(d, i)))
        )
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

  const computeYDomain = (chart) => {
    yDomain = chart.data()
      .reduce((domain, d, i) =>
        [
          Math.min(domain[0], Math.min(fnY0Value(d, i), fnY1Value(d, i))),
          Math.max(domain[1], Math.max(fnY0Value(d, i), fnY1Value(d, i)))
        ]
      , [Infinity, -Infinity])
  }

  const self = {
    ...component(),
    fnY0Value: (value) => {
      if (typeof value === 'undefined') return fnY0Value
      fnY0Value = value
    },
    fnY1Value: (value) => {
      if (typeof value === 'undefined') return fnY1Value
      fnY1Value = value
    },
    yDomain: () => {
      return yDomain
    }
  }

  self.subscribe('draw', draw)
  self.subscribe('computeYDomain', computeYDomain)

  return componentProxy(self)
}

export default bxBars
