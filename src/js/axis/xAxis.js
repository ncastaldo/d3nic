// import * as d3 from '@/js/d3-modules.js'
import AxisComponent from '@/js/axis/axisComponent.js'

export default class XAxis extends AxisComponent {
  constructor (params = {}) {
    super(params)

    const self = this

    self._position = 'position' in params && params.position in self._axisTypes
      ? params.position
      : 'bottom'
  }

  /**
   * @override
   */
  set chart (chart) {
    super.chart = chart

    const self = this

    self._fn_axisTransform = () => `translate(0, ${[self._position === 'top' ? chart.padding.top : chart.size.height - chart.padding.bottom]})`
    self._fn_axis.scale(chart.fn_xScale)
  }

  /**
   * @override
   */
  draw (transition) {
    super.draw(transition)

    const self = this

    self._group.classed('x-axis', true)

    self._group.call(self._fn_draw, transition)
  }
}
