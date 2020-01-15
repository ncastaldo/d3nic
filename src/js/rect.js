import Component from '@/js/component.js'

export default class Rect extends Component {
  constructor (params = {}) {
    super(params)

    const self = this

    self._cover = 'cover' in params ? params.cover : false
    self._fn_opacity = 'fillOpacity' in params ? params.fillOpacity : 0
    self._fn_strokeWidth = 'strokeWidth' in params ? params.strokeWidth : 0
  }

  /**
   * @override
   */
  set chart (chart) {
    super.chart = chart

    const self = this

    const fn_x = () => self._cover ? 0 : chart.padding.left
    const fn_width = () => chart.size.width - (self._cover ? 0 : chart.padding.left - chart.padding.right)
    const fn_y = () => self._cover ? 0 : chart.padding.top
    const fn_height = () => chart.size.height - (self._cover ? 0 : chart.padding.top - chart.padding.bottom)

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
          .call(self._fn_enter)
          .call(enter => enter
            .transition(transition)
            .attr('opacity', self._fn_opacity)),
        update => update
          .call(self._fn_update)
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
          .call(self._fn_exit)
          .call(exit => exit
            .transition(transition)
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

    self._group.classed('rect', true)

    self._group
      .selectAll('rect')
      .data([null])
      .call(self._fn_draw, transition)
  }
}
