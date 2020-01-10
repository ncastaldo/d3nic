import * as d3 from '@/js/d3-modules.js'
import Chart from '@/js/chart.js'

export default class PlanarChart extends Chart {
  constructor (container, params = {}) {
    super(container, params)
  }

  /**
   * @override
   */
  initChart (self, params) {
    super.initChart(self, params)

    self._valueDomain = params.valueDomain || [[NaN, NaN], [NaN, NaN]]

    self._fn_xScale = d3
      .scaleLinear()
      .domain(self.getValueDomain()[0])
      .range([
        self._padding.left,
        self._size.width - self._padding.right
      ])

    self._fn_yScale = d3
      .scaleLinear()
      .domain(self.getValueDomain()[1])
      .range([
        self._size.height - self._padding.bottom,
        self._padding.top
      ])

    console.log(self.getValueDomain())
  }

  /**
   * @override
   */
  getValueDomain () {
    const self = this
    return self._components
      .map(c => c.fn_valueDomain(self._data))
      .reduce((acc, cur) => {
        return [
          d3.extent(acc[0].concat(cur[0])),
          d3.extent(acc[1].concat(cur[1]))
        ]
      }, self._valueDomain)
  }

  /**
   * @override
   */
  updateChart () {
    const self = this

    self._fn_xScale.range([
      self._padding.left,
      self._size.width - self._padding.right
    ])

    self._fn_yScale.range([
      self._size.height - self._padding.bottom,
      self._padding.top
    ])

    self._fn_xScale.domain(self.getValueDomain()[0])
    self._fn_yScale.domain(self.getValueDomain()[1])
  }

  get fn_xScale () {
    const self = this
    return self._fn_xScale
  }

  get fn_yScale () {
    const self = this
    return self._fn_yScale
  }

  /**
   * @override
   */
  draw (transition) {
    super.draw(transition)

    const self = this

    self._group.classed('planar-chart', true)
  }
}
