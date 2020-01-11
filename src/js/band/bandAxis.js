// import * as d3 from '@/js/d3-modules.js'
import XAxis from '@/js/axis/xAxis.js'

export default class BandAxis extends XAxis {
  constructor (params = {}) {
    super(params)
  }

  /**
   * @override
   */
  set chart (chart) {
    super.chart = chart

    const self = this
    self._fn_axis.scale(chart.fn_bandScale)
  }

  getTickValues () {
    const self = this

    const fn_recursive = (tot, max, j) => {
      if (tot / j <= max) return j
      return fn_recursive(tot, max, j + 1)
    }

    const domain = self._chart.fn_bandScale.domain()
    if (self._ticks <= 0) return domain
    const j = fn_recursive(domain.length, self._ticks, 1)
    const correction = Math.floor((domain.length - 1) % j / 2) // how many on the right -> shift in case
    const fn_filter = (d, i) => i % j === correction
    return domain.filter(fn_filter)
  }

  /**
   * @override
   */
  update () {
    super.update()

    const self = this
    self._fn_axis.tickValues(self.getTickValues())
  }

  /**
   * @override
   */
  draw (transition) {
    super.draw(transition)

    const self = this

    self._group.classed('band-axis', true)

    self._group.call(self._fn_draw, transition)
  }
}
