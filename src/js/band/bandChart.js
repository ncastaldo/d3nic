import * as d3 from '@/js/d3-modules.js'
import Chart from '@/js/chart.js'

export default class BandChart extends Chart {
  constructor (container, params = {}) {
    super(container, params)
  }

  /**
   * @override
   */
  initChart (self, params) {
    super.initChart(self, params)

    self._bandPadding = {
      inner: 1,
      outer: 0
    }
    // { inner: 1, outer: [0->1] } -> scalepoint
    // { inner: 0, outer: [0->1] } -> scaleband

    Object.assign(self._bandPadding, params.bandPadding || {})

    self._fn_bandScale = d3
      .scaleBand()
      .paddingInner(self._bandPadding.inner)
      .paddingOuter(self._bandPadding.outer)
      .domain(self._data.map(self._fn_key))
      .range([
        self._padding.left,
        self._size.width - self._padding.right
      ])

    self._fn_yScale = d3
      .scaleLinear()
      .domain(self.getValueDomain(self))
      .range([
        self._size.height - self._padding.bottom,
        self._padding.top
      ])
  }

  /**
   * @override
   */
  updateChart (self) {
    self._fn_bandScale.range([
      self._padding.left,
      self._size.width - self._padding.right
    ])

    self._fn_yScale.range([
      self._size.height - self._padding.bottom,
      self._padding.top
    ])

    self._fn_bandScale.domain(self._data.map(self._fn_key))
    self._fn_yScale.domain(self.getValueDomain(self))
  }

  get fn_bandScale () {
    const self = this
    return self._fn_bandScale
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

    self._group.classed('xy-chart', true)
  }
}
