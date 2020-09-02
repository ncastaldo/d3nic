// import * as d3 from '@/js/d3-modules.js'
import XAxis from '@/js/axis/xAxis.js'

export default class BxAxis extends XAxis {
  constructor (params = {}) {
    super(params)
  }

  /**
   * @override
   */
  set chart (chart) {
    super.chart = chart

    const self = this

    self._fn_axis.scale(chart.fn_bxScale)
  }

  /**
   * @override
   */
  update () {
    super.update()

    const self = this
    self._fn_axis.tickValues(self.getTickValues())
  }
}
