import * as d3 from '@/js/d3-modules.js'
import Component from '@/js/component.js'

export default class AxisComponent extends Component {
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

    self._fn_draw = (group, transition) => {
      const firstTime = !group.attr('transform') // if already transformed

      self._join = group
        .call(axis => {
          firstTime && axis.attr('opacity', 0).attr('transform', self._fn_axisTransform)
        })
        .transition(transition)
        .attr('transform', self._fn_axisTransform)
        .attr('opacity', self._fn_opacity)
        .call(self._fn_axis)
    }
  }

  // to be used only in case of band values
  getTickValues () {
    const self = this

    const fn_recursive = (tot, max, j) => {
      if (tot / j <= max) return j
      return fn_recursive(tot, max, j + 1)
    }

    const domain = self._fn_axis.scale().domain()

    if (self._ticks <= 0) return domain
    const j = fn_recursive(domain.length, self._ticks, 1)
    const correction = Math.floor((domain.length - 1) % j / 2) // how many on the right -> shift in case
    const fn_filter = (d, i) => i % j === correction
    return domain.filter(fn_filter)
  }
}
