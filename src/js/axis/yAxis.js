// import * as d3 from '@/js/d3-modules.js'
import AxisComponent from '@/js/axis/axisComponent.js'

export default class YAxis extends AxisComponent {
  constructor (params = {}) {
    super(params)

    const self = this

    self._position = 'position' in params && params.position in self._axisTypes
      ? params.position
      : 'left'
  }

  /**
   * @override
   */
  set chart (chart) {
    super.chart = chart

    const self = this

    self._fn_axisTransform = () => `translate(${chart.fn_xScale.range()[self._position === 'right' ? 1 : 0]}, 0)`
    self._fn_axis.scale(chart.fn_yScale)
  }

  /**
   * @override
   */
  draw (transition) {
    super.draw(transition)

    const self = this

    self._group.classed('y-axis', true)

    self._group.call(self._fn_draw, transition)
  }
}
