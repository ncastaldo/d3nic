// import * as d3 from '@/js/d3-modules.js'
import BxAxis from '@/js/axis/bxAxis.js'

export default class BandAxis extends BxAxis {
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
}
