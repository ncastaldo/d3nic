import * as d3 from '@/js/d3-modules.js'
import Chart from '@/js/chart.js'

export default class XyChart extends Chart {
  constructor (container, params = {}) {
    super(container, params)
  }

  /**
   * @override
   */
  initChart (self, params) {
    super.initChart(self, params)

    // self._valueDomain = params.valueDomain || [[NaN, NaN], [NaN, NaN]]

    self._bxPadding = { inner: 0, outer: 0 }
    self._byPadding = { inner: 0, outer: 0 }

    // { inner: 1, outer: [0->1] } -> scalepoint
    // { inner: 0, outer: [0->1] } -> scaleband

    Object.assign(self._bxPadding, params.bxPadding || {})
    Object.assign(self._byPadding, params.byPadding || {})

    self._fn_bxScale = d3
      .scaleBand()
      .paddingInner(self._bxPadding.inner)
      .paddingOuter(self._bxPadding.outer)
      .domain(self._data.map((d, i) => self._fn_key(d, i)[0])) // automatic deletion of repetitions
      .range([
        self._padding.top,
        self._size.width - self._padding.right
      ])

    console.log(self._fn_bxScale.domain())

    self._fn_byScale = d3
      .scaleBand()
      .paddingInner(self._byPadding.inner)
      .paddingOuter(self._byPadding.outer)
      .domain(self._data.map((d, i) => self._fn_key(d, i)[1])) // automatic deletion of repetitions
      .range([
        self._size.height - self._padding.bottom,
        self._padding.top
      ])

    console.log(self._fn_byScale.domain())
  }

  /**
   * @override
   *
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
  } */

  /**
   * @override
   */
  updateChart () {
    const self = this

    self._fn_bxScale.range([
      self._padding.left,
      self._size.width - self._padding.right
    ])

    self._fn_byScale.range([
      self._size.height - self._padding.bottom,
      self._padding.top
    ])

    self._fn_bxScale.domain(self._data.map((d, i) => self._fn_key(d, i)[0])) // automatic deletion of repetitions
    self._fn_byScale.domain(self._data.map((d, i) => self._fn_key(d, i)[1])) // automatic deletion of repetitions
  }

  get fn_bxScale () {
    const self = this
    return self._fn_bxScale
  }

  get fn_byScale () {
    const self = this
    return self._fn_byScale
  }

  /**
   * @override
   */
  draw (transition) {
    super.draw(transition)

    const self = this

    self._group.classed('bb-chart', true)
  }
}
