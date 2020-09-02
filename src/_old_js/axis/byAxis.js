// import * as d3 from '@/js/d3-modules.js'
import YAxis from '@/js/axis/yAxis.js'

export default class BxAxis extends YAxis {
  constructor (params = {}) {
    super(params)
  }

  /**
   * @override
   */
  set chart (chart) {
    super.chart = chart

    const self = this

    self._fn_axis.scale(chart.fn_byScale)
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
