import * as d3 from '@/js/d3-modules.js'
import Component from '@/js/component.js'

export default class GeoHexbin extends Component {
  constructor (params = {}) {
    super(params)

    const self = this

    self._fn_value = params.fn_value || ((d, i) => d)
    self._fn_valueDomain = (data) => data.filter(self._fn_defined).map(d => self._fn_value(d))

    self._hexbinData = []
  }

  /**
   * @override
   */
  set chart (chart) {
    super.chart = chart

    const self = this

    const fn_geoPath = d3.geoPath().projection(chart.fn_geoProjection)

    self._fn_path2D = d3.geoPath().projection(chart.fn_geoProjection)

    self._fn_path = (d, i) => self._fn_path2D(self._fn_value(d, i))

    self._fn_x = (d, i) => fn_geoPath.centroid(self._fn_value(d, i))[0]
    self._fn_y = (d, i) => fn_geoPath.centroid(self._fn_value(d, i))[1]

    self._fn_hexbin = d3.hexbin()
      .extent(chart.extent) // super. method
      .radius(2)
      .x(self._fn_x)
      .y(self._fn_y)

    const fn_scaleColor = d3.scaleSequentialLog(d3.interpolateBuPu)

    self._fn_draw = (geoHexbin, transition) => {
      fn_scaleColor.domain([1, d3.max(self._hexbinData, d => d.length)])
      console.log(fn_scaleColor.domain())
      self._join = geoHexbin.join(
        enter => enter
          .append('path')
          .attr('stroke', self._fn_stroke)
          .attr('stroke-width', self._fn_strokeWidth)
          .attr('fill', d => fn_scaleColor(d.length))
          .attr('fill-opacity', self._fn_fillOpacity)
          .attr('transform', (d, i) => `translate(${d.x}, ${d.y})`)
          .attr('d', self._fn_hexbin.hexagon())
          .attr('opacity', 1)
      )
    }
  }

  /**
   * @override
   */
  draw (transition) {
    super.draw(transition)

    const self = this

    self._group.classed('geo-hexbin', true)

    console.time('filter')
    const filtered = self._chart.data.filter(self._fn_defined)
    console.timeEnd('filter')

    console.time('hexbin data')
    self._hexbinData = self._fn_hexbin(filtered)
    console.timeEnd('hexbin data')

    self._group
      .selectAll('path')
      .data(self._hexbinData, self._chart.fn_key)
      .call(self._fn_draw, transition)
  }
}
