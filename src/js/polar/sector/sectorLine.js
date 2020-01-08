import * as d3 from '@/js/d3-modules.js'
import PolarComponent from '@/js/polar/polarComponent.js'

export default class SectorLine extends PolarComponent {
  constructor (params = {}) {
    super(params)

    const self = this

    self._fn_value = params.fn_value || ((d, i) => d)

    self._fn_valueDomain = (data) => d3.extent(data, self._fn_value)
  }

  /**
   * @override
   */
  set chart (chart) {
    super.chart = chart

    const self = this

    const fn_angle = (d, i) => chart.fn_angleScale(chart.fn_key(d, i)) + chart.fn_angleScale.bandwidth() / 2
    const fn_radius = (d, i) => chart.fn_radiusScale(self._fn_value(d, i))

    const fn_innerRadius = (d, i) => chart.fn_radiusScale.range()[0]

    const fn_line = d3.radialLine()
      .defined(self._fn_defined)
      .angle(fn_angle)
      .radius(fn_radius)
      .curve(d3.curveLinearClosed)

    const fn_innerLine = d3.radialLine()
      .defined(self._fn_defined)
      .angle(fn_angle)
      .radius(fn_innerRadius)
      .curve(d3.curveLinearClosed)

    self._fn_draw = (group, transition) => {
      const oldLine = group.selectAll('path.drawn')

      const newLine = group
        .datum(chart.data)
        .append('path')

      if (!oldLine.empty()) {
        oldLine.transition(transition)
          .attr('opacity', 0)
          .remove()
      }

      self._join = newLine.call(line => {
        oldLine.empty()
          ? line.attr('d', fn_innerLine)
          : line.attr('opacity', 0)
      })
        .classed('drawn', true)
        .attr('fill', 'none')
        .attr('stroke', self._fn_stroke)
        .attr('stroke-width', self._fn_strokeWidth)
        .call(self._fn_enter)
        .transition(transition)
        .attr('opacity', self._fn_opacity)
        .attr('d', fn_line)
    }
  }

  /**
   * @override
   */
  draw (transition) {
    super.draw(transition)

    const self = this

    self._group.classed('sector-line', true)

    self._group.call(self._fn_draw, transition)
  }
}
