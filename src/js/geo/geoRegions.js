import * as d3 from '@/js/d3-modules.js'
import Component from '@/js/component.js'

export default class GeoRegions extends Component {
  constructor (params = {}) {
    super(params)

    const self = this

    self._fn_value = params.fn_value || ((d, i) => d)
    self._fn_valueDomain = (data) => data.filter(self._fn_defined).map(d => self._fn_value(d))
  }

  /**
   * @override
   */
  set chart (chart) {
    super.chart = chart

    const self = this

    self._fn_path2D = d3.geoPath().projection(chart.fn_geoProjection)

    self._fn_path = (d, i) => self._fn_path2D(self._fn_value(d, i))

    self._fn_draw = (geoRegions, transition) => {
      self._join = geoRegions.join(
        enter => enter
          .append('path')
          .attr('stroke', self._fn_stroke)
          .attr('stroke-width', self._fn_strokeWidth)
          .attr('fill', self._fn_fill)
          .attr('fill-opacity', self._fn_fillOpacity)
          .attr('opacity', 0)
          .call(self._fn_enter)
          .call(enter => {
            enter.transition(transition)
              .attr('d', self._fn_path)
              .attr('opacity', self._fn_opacity)
          }),
        update => update
          .call(self._fn_update)
          .call(update => {
            update.transition(transition)
              .attr('d', self._fn_path)
              .attr('stroke', self._fn_stroke)
              .attr('stroke-width', self._fn_strokeWidth)
              .attr('fill', self._fn_fill)
              .attr('opacity', self._fn_opacity)
          }),
        exit => exit
          .call(self._fn_exit)
          .call(exit => {
            exit.transition(transition)
              .attr('d', self._fn_path)
              .attr('opacity', 0)
              .remove()
          })
      )
    }
  }

  /**
   * @override
   */
  draw (transition) {
    super.draw(transition)

    const self = this

    self._group.classed('geo-regions', true)

    self._group
      .selectAll('path')
      .data(self._componentData, self._chart.fn_key)
      .call(self._fn_draw, transition)
  }
}
