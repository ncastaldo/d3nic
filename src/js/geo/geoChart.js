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
  updateChart () {
    const self = this
    self._extent = self.getExtent(self)
    self.fitProjection(self)
  }

  /**
   * @override
   */
  getValueDomain () {
    const self = this
    return self._valueDomain || self._components
      .map(c => c.fn_valueDomain(self._data))
      .flat(1)
  }

  // helper function
  getExtent () {
    const self = this
    return [
      [self._padding.left, self._padding.top],
      [self._size.width - self._padding.right, self._size.height - self._padding.bottom]
    ]
  }

  fitProjection () {
    const self = this
    self._fn_geoProjection.fitExtent(self._extent, {
      type: 'GeometryCollection',
      geometries: self.getValueDomain(self)
    })
  }

  /**
   * @override
   */
  get extent () {
    const self = this
    return self._extent
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
