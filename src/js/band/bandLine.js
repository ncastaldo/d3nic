import * as d3 from '@/js/d3-modules.js'
import Component from '@/js/component.js'

export default class BandLine extends Component {
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

    const fn_x = (d, i) => chart.fn_bandScale(chart.fn_key(d, i)) + chart.fn_bandScale.bandwidth() / 2
    const fn_y = (d, i) => chart.fn_yScale(self._fn_value(d, i))

    const fn_y0 = (d, i) => chart.fn_yScale.range()[0]

    const fn_line = d3.line()
      .defined(self._fn_defined)
      .x(fn_x)
      .y(fn_y)
      .curve(d3.curveMonotoneX)

    const fn_lineBottom = d3.line()
      .defined(self._fn_defined)
      .x(fn_x)
      .y(fn_y0)
      .curve(d3.curveMonotoneX)

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
        oldLine.empty() && line.attr('d', fn_lineBottom)
        line.attr('opacity', 0)
      })
        .classed('drawn', true)
        .attr('fill', 'none')
        .attr('stroke', self._fn_stroke)
        .attr('stroke-width', self._fn_strokeWidth)
        .attr('stroke-dasharray', self._fn_strokeDasharray)
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

    self._group.classed('band-line', true)

    self._group.call(self._fn_draw, transition)
  }
}
