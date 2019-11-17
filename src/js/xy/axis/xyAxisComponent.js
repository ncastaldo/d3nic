import * as d3 from '@/js/d3-modules.js'
import Component from '@/js/component.js'

export default class XyAxisComponent extends Component {
  constructor (params = {}) {
    super(params)

    const self = this

    self._ticks = 'ticks' in params ? params.ticks : 5
    self._tickFormat = 'tickFormat' in params ? params.tickFormat : d3.format('.0f')
    self._tickSizeInner = 'tickSizeInner' in params ? params.tickSizeInner : 0
    self._tickSizeOuter = 'tickSizeOuter' in params ? params.tickSizeOuter : 0
    self._tickPadding = 'tickPadding' in params ? params.tickPadding : 8

    self._axisType = 'axisType' in params ? params.axisType : d3.axisBottom()
  }

  /**
   * @override
   */
  set chart (chart) {
    super.chart = chart

    const self = this

    self._fn_axis = self._axisType()
      .ticks(self._ticks)
      .tickFormat(self._xTickFormat)
      .tickSizeInner(self._tickSizeInner)
      .tickSizeOuter(self._tickSizeOuter)
      .tickPadding(self._tickPadding)
  }
}
