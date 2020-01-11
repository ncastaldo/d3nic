import * as d3 from '@/js/d3-modules.js'
import Component from '@/js/component.js'

export default class XyArea extends Component {
  constructor (params = {}) {
    super(params)

    const self = this

    self._fn_bottomValue = params.fn_bottomValue || ((d) => NaN)
    self._fn_topValue = params.fn_topValue || ((d) => d)

    self._fn_valueDomain = (data) => d3.extent(
      data.map((d, i) => [
        self._fn_bottomValue(d, i),
        self._fn_topValue(d, i)
      ]).flat()
    )
  }

  /**
   * @override
   */
  set chart (chart) {
    super.chart = chart

    const self = this

    const fn_x = (d, i) => chart.fn_bandScale(chart.fn_key(d, i)) + chart.fn_bandScale.bandwidth() / 2

    const fn_y0 = (d, i) => !isNaN(self._fn_bottomValue(d, i))
      ? chart.fn_yScale(self._fn_bottomValue(d, i))
      : chart.fn_yScale.range()[0]
    const fn_y1 = (d, i) => chart.fn_yScale(self._fn_topValue(d, i))

    const fn_area = d3.area()
      .defined(self._fn_defined)
      .x(fn_x)
      .y0(fn_y0)
      .y1(fn_y1)
      .curve(d3.curveMonotoneX)

    const fn_areaBottom = d3.area()
      .defined(self._fn_defined)
      .x(fn_x)
      .y0(fn_y0)
      .y1(fn_y0)
      .curve(d3.curveMonotoneX)

    self._fn_draw = (group, transition) => {
      const oldArea = group.selectAll('path.drawn')

      const newArea = group
        .datum(chart.data)
        .append('path')

      if (!oldArea.empty()) {
        oldArea.transition(transition)
          .attr('opacity', 0)
          .remove()
      }

      self._join = newArea.call(area => {
        oldArea.empty()
          ? area.attr('d', fn_areaBottom)
          : area.attr('opacity', 0)
      })
        .classed('drawn', true)
        .attr('fill', self._fn_fill)
        .attr('fill-opacity', self._fn_fillOpacity)
        .call(self._fn_enter)
        .transition(transition)
        .attr('opacity', self._fn_opacity)
        .attr('d', fn_area)
    }
  }

  /**
   * @override
   */
  draw (transition) {
    super.draw(transition)

    const self = this

    self._group.classed('xy-area', true)

    self._group.call(self._fn_draw, transition)
  }
}
