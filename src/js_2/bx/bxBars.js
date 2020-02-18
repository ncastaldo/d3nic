
import component from '../base/component'
import { componentProxy, hasRegistry } from '../common'

const hasBars = ({ registry = hasRegistry } = {}) => {
  let fnLowValue = d => 0
  let fnHighValue = d => d

  let contDomain = [0, 1]

  const self = {
    ...registry(),
    fnLowValue: (value) => {
      if (typeof value === 'undefined') return fnLowValue
      fnLowValue = value
    },
    fnHighValue: (value) => {
      if (typeof value === 'undefined') return fnHighValue
      fnHighValue = value
    },
    contDomain: () => {
      return contDomain
    }
  }

  const computeContDomain = (chart) => {
    contDomain = chart.data()
      .reduce((domain, d, i) =>
        [
          Math.min(domain[0], Math.min(fnLowValue(d, i), fnHighValue(d, i))),
          Math.max(domain[1], Math.max(fnLowValue(d, i), fnHighValue(d, i)))
        ]
      , [Infinity, -Infinity])
  }

  console.log('before subscribing hasBars')
  self.log()
  self.subscribe('computeContDomain', computeContDomain)
  console.log('after subscribing hasBars')
  self.log()
  console.log('OK')

  return self
}

const bxBars = ({ registry = hasRegistry } = {}) => {
  const self = {
    ...registry(),
    ...component(),
    ...hasBars()
  }

  self.log()

  const fnDraw = (fnDraw, chart) => {
    const x = (d, i) => chart.fnBandXScale()(chart.fnBandValue()(d, i))
    const width = chart.fnBandXScale().bandwidth()

    const yBefore = (d, i) => chart.fnContYScale()(self.fnLowValue(d, i))
    const y = (d, i) => chart.fnContYScale()(self.fnHighValue(d, i))
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
    console.log('component bxBars')
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
