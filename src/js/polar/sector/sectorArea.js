import * as d3 from '@/js/d3-modules.js'
import PolarComponent from '@/js/polar/polarComponent.js'

export default class SectorArea extends PolarComponent {
  constructor (params = {}) {
    super(params)

    const self = this

    self._fn_innerValue = params.fn_innerValue || ((d) => NaN)
    self._fn_outerValue = params.fn_outerValue || ((d) => d)

    self._fn_valueDomain = (data) => d3.extent(
      data.map((d, i) => [
        self._fn_bottomValue(d, i),
        self._fn_topValue(d, i)
      ]).flat()
    )
  }

  /**
   * @override
   */
  set chart (chart) {
    super.chart = chart

    const self = this

    const fn_angle = (d, i) => chart.fn_angleScale(chart.fn_key(d, i)) + chart.fn_angleScale.bandwidth() / 2

    const fn_innerRadius = (d, i) => !isNaN(self._fn_innerValue(d, i))
      ? chart.fn_radiusScale(self._fn_innerValue(d, i))
      : chart.fn_radiusScale.range()[0]
    const fn_outerRadius = (d, i) => chart.fn_radiusScale(self._fn_outerValue(d, i))

    const fn_area = d3.radialArea()
      .defined(self._fn_defined)
      .angle(fn_angle)
      .innerRadius(fn_innerRadius)
      .outerRadius(fn_outerRadius)
      .curve(d3.curveLinearClosed)

    const fn_innerArea = d3.radialArea()
      .defined(self._fn_defined)
      .angle(fn_angle)
      .innerRadius(fn_innerRadius)
      .outerRadius(fn_innerRadius)
      .curve(d3.curveLinearClosed)

    self._fn_draw = (group, transition) => {
      const oldArea = group.selectAll('path.drawn')

      const newArea = group
        .datum(chart.data)
        .append('path')

      if (!oldArea.empty()) {
        oldArea.transition(transition)
          .attr('opacity', 0)
          .remove()
      }

      self._join = newArea
        .call(area => {
          oldArea.empty()
            ? area.attr('d', fn_innerArea)
            : area.attr('opacity', 0)
        })
        .classed('drawn', true)
        .attr('fill', self._fn_fill)
        .attr('fill-opacity', self._fn_fillOpacity)
        .call(self._fn_enter)
        .transition(transition)
        .attr('opacity', self._fn_opacity)
        .attr('d', fn_area)
    }
  }

  /**
   * @override
   */
  draw (transition) {
    super.draw(transition)

    const self = this

    self._group.classed('sector-area', true)

    self._group.call(self._fn_draw, transition)
  }
}
