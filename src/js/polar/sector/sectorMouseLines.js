// import * as d3 from '@/js/d3-modules.js'
import PolarComponent from '@/js/polar/polarComponent.js'

export default class SectorMouseLines extends PolarComponent {
  constructor (params = {}) {
    super(params)

    const self = this
    self._fn_strokeDasharray = params.fn_strokeDasharray || ((d, i) => [2, 2])
  }

  /**
   * @override
   */
  set chart (chart) {
    super._chart = chart

    const self = this

    const fn_angle = (d, i) => chart.fn_angleScale(chart.fn_key(d, i)) + chart.fn_angleScale.bandwidth() / 2

    self._fn_draw = (mouseLines, transition) => {
      const radiusExtent = chart.fn_radiusScale.range()

      self._join = mouseLines.join(
        enter => enter
          .append('path')
          .attr('d', (d, i) => `M ${fn_angle(d, i)}, ${radiusExtent[0]} ${fn_angle(d, i)}, ${radiusExtent[0]}`)
          .attr('stroke', self._fn_stroke)
          .attr('stroke-width', self._fn_strokeWidth)
          .attr('stroke-dasharray', (d, i) => `${self._fn_strokeDasharray(d, i)[0]}, ${self._fn_strokeDasharray(d, i)[1]}`)
          .attr('opacity', 0)
          .call(self.fn_enter)
          .call(enter =>
            enter
              .transition(transition)
              .attr('d', (d, i) => `M ${fn_angle(d, i)}, ${radiusExtent[0]} ${fn_angle(d, i)}, ${radiusExtent[1]}`)
              .attr('opacity', self._fn_opacity)),
        update => update
          .call(update =>
            update
              .transition(transition)
              .attr('opacity', self._fn_opacity)
              .attr('d', (d, i) => 'M' + fn_angle(d, i) + ',' + radiusExtent[0] + ' ' + fn_angle(d, i) + ',' + radiusExtent[1])
          ),
        exit => exit
          .call(exit =>
            exit
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

    self._group.classed('xy-mouse-lines', true)

    self._group
      .selectAll('path')
      .data(self._chart.data.filter(self._fn_defined), self._chart.fn_key)
      .call(self._fn_draw, transition)
  }
}
