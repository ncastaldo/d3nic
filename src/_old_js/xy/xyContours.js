import * as d3 from '@/js/d3-modules.js'
import Component from '@/js/component.js'

export default class XyContours extends Component {
  constructor (params = {}) {
    super(params)

    const self = this

    self._fn_weight = params.fn_weight || (d3.randomInt(1, 10)) // radius function for each bin

    self._fn_value = params.fn_value || ((d, i) => d)
    self._fn_valueDomain = (data) => data.filter(self._fn_defined).map(d => self._fn_value(d))
  }

  /**
   * @override
   */
  set chart (chart) {
    super.chart = chart

    const self = this

    const fn_xContour = (d, i) => chart.fn_xScale(self._fn_value(d, i)[0])
    const fn_yContour = (d, i) => chart.fn_yScale(self._fn_value(d, i)[1])

    self._fn_contourDensity = d3.contourDensity()
      .size([
        chart.extent[1][0] - chart.extent[0][0],
        chart.extent[1][1] - chart.extent[0][1]
      ])
      .x(fn_xContour)
      .y(fn_yContour)
      .weight(self._fn_weight)
      // thresholds

    self._fn_path = d3.geoPath()

    self._fn_x = (d, i) => chart.extent[0][0]
    self._fn_y = (d, i) => chart.extent[0][1]

    self._fn_draw = (xyContours, transition) => {
      self._join = xyContours.join(
        enter => enter
          .append('path')
          .attr('stroke', self._fn_stroke)
          .attr('stroke-width', self._fn_strokeWidth)
          .attr('fill', self._fn_fill)
          .attr('fill-opacity', self._fn_fillOpacity)
          // transformation must be done because contours do not have "extent"
          .attr('transform', (d, i) => `translate(${self._fn_x(d, i)}, ${self._fn_y(d, i)})`)
          .attr('d', self._fn_path)
          .attr('opacity', 0)
          .call(self._fn_enter)
          .call(enter => {
            enter.transition(transition)
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
    super.update() // ??

    const self = this

    if ('fakeKey' in self) { ++self._fakeKey } else { self._fakeKey = 0 }

    self._componentData = self._fn_contourDensity(self._chart.data.filter(self._fn_defined))
    self._componentData.forEach(d => { d._fakeKey = self._fakeKey })
  }

  /**
   * @override
   */
  draw (transition) {
    super.draw(transition)

    const self = this

    self._group.classed('xy-contours', true)

    self._group
      .selectAll('path')
      .data(self._componentData, d => d._fakeKey)// self._chart.fn_key)
      .call(self._fn_draw, transition)
  }
}
