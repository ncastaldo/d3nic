import * as d3 from '@/js/d3-modules.js'
import Component from '@/js/component.js'

export default class XyAxisComponent extends Component {
  constructor (params = {}) {
    super(params)

    const self = this

    self._ticks = 'ticks' in params ? params.ticks : 5
    self._tickFormat = 'tickFormat' in params ? params.tickFormat : d3.format('.0f')
    self._tickSizeInner = 'tickSizeInner' in params ? params.tickSizeInner : 6
    self._tickSizeOuter = 'tickSizeOuter' in params ? params.tickSizeOuter : 6
    self._tickPadding = 'tickPadding' in params ? params.tickPadding : 8

    self._axisTypes = {
      top: d3.axisTop,
      right: d3.axisRight,
      bottom: d3.axisBottom,
      left: d3.axisLeft
    }
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

    const axisType = self._axisTypes[self._position]

    self._fn_axis = axisType()
      .ticks(self._ticks)
      .tickFormat(self._tickFormat)
      .tickSizeInner(self._tickSizeInner)
      .tickSizeOuter(self._tickSizeOuter)
      .tickPadding(self._tickPadding)
  }
}
