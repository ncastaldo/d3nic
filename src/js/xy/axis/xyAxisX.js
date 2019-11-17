import * as d3 from '@/js/d3-modules.js'
import XyAxisComponent from '@/js/xy/axis/xyAxisComponent.js'

export default class XyAxisX extends XyAxisComponent {
  constructor (params = {}) {
    super(params)

    const self = this

    self._axisType = 'axisType' in params ? params.axisType : d3.axisBottom()
  }

  /**
   * @override
   */
  set chart (chart) {
    super.chart = chart

    const self = this

    self._fn_axis.scale(chart.fn_xScale)

    const fn_axisTransform = () => `translate(0, ${chart.fn_yScale.range()[0]})`

    const fn_recursive = (tot, max, j) => {
      if (tot / j <= max) return j
      return fn_recursive(tot, max, j + 1)
    }

    const fn_tickValues = () => {
      const domain = chart.fn_xScale.domain()
      if (self._ticks <= 0) return domain
      const j = fn_recursive(domain.length, self._ticks, 1)
      const correction = Math.floor((domain.length - 1) % j / 2) // how many on the right -> shift in case
      const fn_filter = (d, i) => i % j === correction
      return domain.filter(fn_filter)
    }

    self._fn_draw = (group, transition) => {
      self._fn_axis.tickValues(fn_tickValues())

      const firstTime = group.attr('transform') // if already transformed

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

    self._group.classed('x-axis', true)

    self._chart.group.call(self._fn_draw, transition)
  }
}
