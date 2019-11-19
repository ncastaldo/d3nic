import Component from '@/js/component.js'

export default class Rect extends Component {
  constructor (params = {}) {
    super(params)
  }

  /**
   * @override
   */
  set chart (chart) {
    super.chart = chart

    const fn_x = () => chart.padding.left
    const fn_width = () => chart.size.width - chart.padding.left - chart.padding.right
    const fn_y = () => chart.padding.top
    const fn_height = () => chart.size.height - chart.padding.top - chart.padding.bottom

    const self = this

    self._fn_draw = (group, transition) => {
      self._join = group.join(
        enter => enter
          .append('rect')
          .attr('x', fn_x)
          .attr('width', fn_width)
          .attr('y', fn_y)
          .attr('height', fn_height)
          .attr('fill', self._fn_fill)
          .attr('fill-opacity', self._fn_fillOpacity)
          .attr('stroke', self._fn_stroke)
          .attr('stroke-width', self._fn_strokeWidth)
          .attr('opacity', 0)
          .call(enter => enter
            .transition(transition)
            .attr('opacity', self._fn_opacity)),
        update => update
          .call(update => update
            .attr('x', fn_x)
            .attr('width', fn_width)
            .attr('y', fn_y)
            .attr('height', fn_height)
            .attr('fill', self._fn_fill)
            .attr('fill-opacity', self._fn_fillOpacity)
            .attr('stroke', self._fn_stroke)
            .attr('stroke-width', self._fn_strokeWidth)
            .attr('opacity', self._fn_opacity)),
        exit => exit
          .call(exit => exit
            .transition(transition)
            .attr('opacity', 0))
      )
    }
  }

  /**
   * @override
   */
  draw (transition) {
    super.draw(transition)

    const self = this

    self._group.classed('rect', true)

    self._group
      .selectAll('rect')
      .data([1])
      .call(self._fn_draw, transition)
  }
}
