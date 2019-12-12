// import * as d3 from '@/js/d3-modules.js'
import XyAxisComponent from '@/js/xy/axis/xyAxisComponent.js'

export default class XyYAxis extends XyAxisComponent {
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

    self._fn_axis.scale(chart.fn_yScale)

    const fn_axisTransform = () => `translate(${chart.fn_xScale.range()[self._position === 'right' ? 1 : 0]}, 0)`

    self._fn_draw = (group, transition) => {
      const firstTime = !group.attr('transform') // if already transformed

      self._join = group
        .call(axis => {
          firstTime && axis.attr('opacity', 0).attr('transform', fn_axisTransform)
        })
        .transition(transition)
        .attr('transform', fn_axisTransform)
        .attr('opacity', self._fn_opacity)
        .call(self._fn_axis)
    }
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
