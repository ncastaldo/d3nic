import * as d3 from '@/js/d3-modules.js'
import PolarChart from '@/js/polar/polarChart.js'

export default class SectorChart extends PolarChart {
  constructor (container, params = {}) {
    super(container, params)
  }

  /**
   * @override
   */
  initChart (self, params) {
    super.initChart(self, params)

    self._anglePadding = {
      inner: 1,
      outer: 0
    }
    // { inner: 1, outer: [0->1] } -> scalepoint
    // { inner: 0, outer: [0->1] } -> scaleband

    Object.assign(self._anglePadding, params.anglePadding || {})

    self._fn_radiusScale = d3
      .scaleLinear()
      .domain(self.getValueDomain(self))
      .range(self.getRadiusRange(self))

    self._fn_angleScale = d3
      .scaleBand()
      .paddingInner(self._anglePadding.inner)
      .paddingOuter(self._anglePadding.outer)
      .domain(self._data.map(self._fn_key))
      .range(self._angleRange)
  }

  /**
   * @override
   */
  set size (size) {
    super.size = size

    const self = this
    self._fn_radiusScale.range(self.getRadiusRange(self))
  }

  /**
   * @override
   */
  get components () {
    return super.components
  }

  /**
   * @override
   */
  set components (components) {
    super.components = components

    const self = this
    self._fn_radiusScale.domain(self.getValueDomain(self))
  }

  /**
   * @override
   */
  get data () {
    return super.data
  }

  /**
   * @override
   */
  set data (data) {
    super.data = data

    const self = this
    self._fn_angleScale.domain(self._data.map(self._fn_key))
    self._fn_radiusScale.domain(self.getValueDomain(self))
  }

  get fn_radiusScale () {
    const self = this
    return self._fn_radiusScale
  }

  get fn_angleScale () {
    const self = this
    return self._fn_angleScale
  }

  /**
   * @override
   */
  draw (transition) {
    super.draw(transition)

    const self = this

    self._group.classed('sector-chart', true)
  }
}
