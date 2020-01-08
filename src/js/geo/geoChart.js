import * as d3 from '@/js/d3-modules.js'
import Chart from '@/js/chart.js'

export default class GeoChart extends Chart {
  constructor (container, params = {}) {
    super(container, params)
  }

  /**
   * @override
   */
  initChart (self, params) {
    super.initChart(self, params)

    self._valueDomain = params.valueDomain || null
    self._projectionType = params.projectionType || d3.geoMercator
    self._fn_geoProjection = self._projectionType()

    self._extent = self.getExtent(self)
    self.fitProjection(self)
  }

  /**
   * @override
   */
  getValueDomain (self) {
    return self._valueDomain || self._components
      .map(c => c.fn_valueDomain(self._data))
      .flat(1)
  }

  // helper function
  getExtent (self) {
    return [
      [self._padding.left, self._padding.top],
      [self._size.width - self._padding.right, self._size.height - self._padding.bottom]
    ]
  }

  fitProjection (self) {
    self._fn_geoProjection.fitExtent(self._extent, {
      type: 'GeometryCollection',
      geometries: self.getValueDomain(self)
    })
  }

  /**
   * @override
   */
  get size () {
    return super.size
  }

  /**
   * @override
   */
  set size (size) {
    super.size = size

    const self = this
    self._extent = self.getExtent(self)
    self.fitProjection(self)
  }

  /**
   * @override
   */
  get extent () {
    const self = this
    return self._extent
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
    self.fitProjection(self)
  }

  get fn_geoProjection () {
    const self = this
    return self._fn_geoProjection
  }

  /**
   * @override
   */
  draw (transition) {
    super.draw(transition)

    const self = this
    self._group.classed('geo-chart', true)
  }
}
