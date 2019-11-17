import * as d3 from '@/js/d3-modules.js'
import Component from '@/js/component.js'

export default class XyMouseLines extends Component {
  constructor (params = {}) {
    super(params)

    const self = this

    /** @Override */
    self._fn_strokeDasharray = params.fn_strokeDasharray || ((d, i) => [2, 2])

    self._fn_bottomValue = params.fn_bottomValue || ((d) => NaN)
    self._fn_topValue = params.fn_topValue || ((d) => NaN)

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

    const fn_x = (d, i) => chart.fn_xScale(chart.fn_key(d, i)) + chart.fn_xScale.bandwidth() / 2

    const fn_yTop = (d, i) => !isNaN(self._fn_topValue(d, i))
      ? chart.fn_yScale(self._fn_topValue(d, i))
      : chart.fn_yScale.range()[1]

    const fn_yBottom = (d, i) => !isNaN(self._fn_bottomValue(d, i))
      ? chart.fn_yScale(self._fn_bottomValue(d, i))
      : chart.fn_yScale.range()[0]

    self._fn_draw = (mouseLines, transition) => {
      self._join = mouseLines.join(
        enter => enter
          .append('line')
          .attr('x1', fn_x)
          .attr('x2', fn_x)
          .attr('y1', fn_yBottom)
          .attr('y2', fn_yBottom)
          .attr('stroke', self._fn_stroke)
          .attr('stroke-width', self._fn_strokeWidth)
          .attr('stroke-dasharray', self._fn_strokeDasharray)
          .attr('opacity', 0)
          .call(self._fn_enter)
          .call(enter =>
            enter
              .transition(transition)
              .attr('y2', fn_yTop)
              .attr('opacity', self._fn_opacity)),
        update => update
          .call(update =>
            update
              .transition(transition)
              .attr('opacity', self._fn_opacity)
              .attr('x1', fn_x)
              .attr('x2', fn_x)
              .attr('y1', fn_yBottom)
              .attr('y2', fn_yTop)
          ),
        exit => exit
          .call(exit =>
            exit
              .transition(transition)
              .attr('y2', fn_yBottom)
              .attr('opacity', 0)
              .remove())
      )
    }
  }

  /**
   * @override
   */
  draw (transition) {
    super.draw(transition)

    const self = this

    self._group.classed('xy-mouse-lines', true)

    self._group
      .selectAll('path')
      .data(self._chart.data.filter(self._fn_defined), self._chart.fn_key)
      .call(self._fn_draw, transition)
  }
}
