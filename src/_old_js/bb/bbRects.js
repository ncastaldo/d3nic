// import * as d3 from '@/js/d3-modules.js'
import Component from '@/js/component.js'

export default class BbRects extends Component {
  constructor (params = {}) {
    super(params)
  }

  /**
   * @override
   */
  set chart (chart) {
    super.chart = chart

    const self = this

    const fn_x = (d, i) => chart.fn_bxScale(chart.fn_key(d, i)[0])
    const fn_width = (d, i) => chart.fn_bxScale.bandwidth()

    const fn_y = (d, i) => chart.fn_byScale(chart.fn_key(d, i)[1])
    const fn_height = (d, i) => chart.fn_byScale.bandwidth()

    self._fn_draw = (bars, transition) => {
      self._join = bars.join(
        enter => enter
          .append('rect')
          .attr('x', fn_x)
          .attr('width', fn_width)
          .attr('y', fn_y)
          .attr('height', fn_height)
          .attr('stroke', self._fn_stroke)
          .attr('stroke-width', self._fn_strokeWidth)
          .attr('fill', self._fn_fill)
          .attr('fill-opacity', self._fn_fillOpacity)
          .attr('opacity', 0)
          .call(self._fn_enter)
          .call(enter => self.multiTransition(enter, transition)
            .attr('opacity', self._fn_opacity)),
        update => update
          .call(update => update.transition(transition)
            .attr('fill', self._fn_fill)
            .attr('fill-opacity', self._fn_fillOpacity)
            .attr('x', fn_x)
            .attr('width', fn_width)
            .attr('y', fn_y)
            .attr('height', fn_height)
            .attr('opacity', self._fn_opacity)),
        exit => exit
          .call(exit => self.multiTransition(exit, transition)
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

    self._group.classed('bb-rects', true)

    self._group.selectAll('rect')
      .data(self._componentData, (d, i) => `${self._chart.fn_key(d, i)[0]}-${self._chart.fn_key(d, i)[1]}`)
      .call(self._fn_draw, transition)
  }
}
