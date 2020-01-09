import * as d3 from '@/js/d3-modules.js'
import Component from '@/js/component.js'

export default class GeoHexbin extends Component {
  constructor (params = {}) {
    super(params)

    const self = this

    self._radius = params.radius || 10 // radius to calculate the bins
    self._fn_radius = params.fn_radius || (d3.randomInt(1, 10)) // radius function for each bin

    self._fn_value = params.fn_value || ((d, i) => d)
    self._fn_valueDomain = (data) => data.filter(self._fn_defined).map(d => self._fn_value(d))
  }

  /**
   * @override
   */
  set chart (chart) {
    super.chart = chart

    const self = this

    const fn_geoPath = d3.geoPath().projection(chart.fn_geoProjection)

    const fn_xHexbin = (d, i) => fn_geoPath.centroid(self._fn_value(d, i))[0]
    const fn_yHexbin = (d, i) => fn_geoPath.centroid(self._fn_value(d, i))[1]

    self._fn_hexbin = d3.hexbin()
      .extent(chart.extent) // super. method
      .radius(self._radius)
      .x(fn_xHexbin)
      .y(fn_yHexbin)

    // context-hxbin -> integrated canvas not yet supported
    // self._fn_path2D = d3.geoPath().projection(chart.fn_geoProjection)
    self._fn_x = (d, i) => d.x
    self._fn_y = (d, i) => d.y
    self._fn_path = (d, i) => self._fn_hexbin.hexagon(self._fn_radius(d, i))

    const fn_pathInitial = (d, i) => self._fn_hexbin.hexagon(0)

    self._fn_draw = (geoHexbin, transition) => {
      self._join = geoHexbin.join(
        enter => enter
          .append('path')
          .attr('stroke', self._fn_stroke)
          .attr('stroke-width', self._fn_strokeWidth)
          .attr('fill', self._fn_fill)
          .attr('fill-opacity', self._fn_fillOpacity)
          .attr('transform', (d, i) => `translate(${self._fn_x(d, i)}, ${self._fn_y(d, i)})`)
          .attr('d', fn_pathInitial)
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
              .attr('transform', (d, i) => `translate(${self._fn_x(d, i)}, ${self._fn_y(d, i)})`)
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
              .attr('transform', (d, i) => `translate(${self._fn_x(d, i)}, ${self._fn_y(d, i)})`)
              .attr('d', fn_pathInitial)
              .attr('opacity', 0)
              .remove()
          })
      )
    }
  }

  /**
   * @override
   */
  update () {
    // console.time('hexbin data')
    super.update() // ??

    const self = this
    console.log('updating')
    self._componentData = self._fn_hexbin(self._chart.data.filter(self._fn_defined))
    // console.timeEnd('hexbin data')
  }

  /**
   * @override
   */
  draw (transition) {
    super.draw(transition)

    const self = this

    self._group.classed('geo-hexbin', true)

    self._group
      .selectAll('path')
      .data(self._componentData, self._chart.fn_key)
      .call(self._fn_draw, transition)
  }
}
