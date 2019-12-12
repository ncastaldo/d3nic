// import * as d3 from '@/js/d3-modules.js'
import Chart from '../chart.js'

export default class PolarChart extends Chart {
  constructor (container, params = {}) {
    super(container, params)
  }

  /**
   * @override
   */
  initChart (self, params) {
    super.initChart(self, params)

    self._radiusRangeProportions = params.radiusRangeProportions || [0, 1]
    self._angleRange = params.angleRange || [0, 2 * Math.PI] // may be, for instance, [0, 2/3*Math.PI]
  }

  getRadiusRange (self) {
    const radius = Math.min(self._size.width - self._padding.left - self._padding.right, self._size.height - self._padding.top - self._padding.bottom) / 2

    return self._radiusRangeProportions.map(rrp => rrp * radius)
  }

  getCentroid (self) {
    return [
      self._size.width + self._padding.left - self._padding.right,
      self._size.height + self._padding.top - self._padding.bottom
    ].map(n => n / 2)
  }

  /**
   * @override
   */
  draw (transitionObject) {
    super.draw(transitionObject)

    const self = this

    // for the moment polar charts do not support canvas:
    // need to reposition element based on group-centroid

    const fn_translateGroup = (group) => {
      const centroid = self.getCentroid(self)
      const firstDraw = !self._group.classed('polar-chart')
      const translate = `translate(${centroid[0]}, ${centroid[1]})`
      group.classed('polar-chart', true)

      if (firstDraw) {
        group.attr('transform', translate)
      } else {
        group.transition(self._transition)
          .attr('transform', translate)
      }
    }

    // if first time

    self._group.call(fn_translateGroup)
  }
}
