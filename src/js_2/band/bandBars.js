import * as d3 from '@/js/d3-modules.js'

import component from '../base/component'
import { componentProxy } from '../common'

const bandBars = () => {
  let fnBottomValue = d => 0
  let fnTopValue = d => d

  let contDomain = [0, 1]

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
    contDomain: () => {
      return contDomain
    }
  }

  const fnDraw = (fnDraw, chart) => {
    const v = !chart.horizontal()

    const fnBandResult = (d, i) => chart.fnBandScale()(chart.fnBandValue()(d, i))
    const fnBandwidth = (d, i) => chart.fnBandScale().bandwidth()

    const fnContBottomResult = (d, i) => chart.fnContScale()(fnBottomValue(d, i))
    const fnContTopResult = (d, i) => chart.fnContScale()(fnTopValue(d, i))

    const fnBarLength = (d, i) => Math.abs(fnContBottomResult(d, i) - fnContTopResult(d, i))

    const fnBefore = selection =>
      selection
        .attr(v ? 'x' : 'y', fnBandResult)
        .attr(v ? 'width' : 'height', fnBandwidth)
        .attr(v ? 'y' : 'x', fnContBottomResult)
        .attr(v ? 'height' : 'width', 0)
        .attr('opacity', 0)

    const fnNow = selection =>
      selection
        .attr(v ? 'x' : 'y', fnBandResult)
        .attr(v ? 'width' : 'height', fnBandwidth)
        .attr(v ? 'y' : 'x', fnContBottomResult)
        .attr(v ? 'height' : 'width', fnBarLength)
        .attr('opacity', 1)

    const fnAfter = selection =>
      selection
        .attr(v ? 'height' : 'width', 0)
        .attr('opacity', 0)

    const join = fnDraw.join(
      enter => enter
        .append('rect')
        .call(self.fnStyle)
        .call(fnBefore)
        .call(enter => enter
          .transition(chart.transition())
          .call(fnNow)),
      update => update
        .call(update =>
          update.transition(chart.transition())
            .call(self.fnStyle)
            .call(fnNow)
        ),
      exit => exit
        .call(exit => exit
          .transition(chart.transition())
          .call(fnAfter))
    )
    self.join(join)
  }
  const draw = (chart) => {
    self.group()
      .classed('bandBars', true)
      .selectAll('rect')
      .data(chart.data(), chart.fnKey())
      .call(fnDraw, chart)
  }
  self.subscribe('draw', draw)

  const computeContDomain = (chart) => {
    contDomain = chart.data()
      .reduce((domain, d, i) =>
        [
          Math.min(domain[0], Math.min(fnBottomValue(d, i), fnTopValue(d, i))),
          Math.max(domain[1], Math.max(fnBottomValue(d, i), fnTopValue(d, i)))
        ]
      , [Infinity, -Infinity])
  }
  self.subscribe('computeContDomain', computeContDomain)

  return componentProxy(self)
}

export default bandBars
