import * as d3 from '@/js/d3-modules.js'
import PolarComponent from '@/js/polar/polarComponent.js'

export default class SectorBars extends PolarComponent {
  constructor (params = {}) {
    super(params)

    const self = this

    self._fn_bottomValue = params.fn_bottomValue || ((d) => NaN)
    self._fn_topValue = params.fn_topValue || ((d) => d)

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

    const fn_startAngle = (d, i) => chart.fn_angleScale(chart.fn_key(d, i))
    const fn_endAngle = (d, i) => chart.fn_angleScale(chart.fn_key(d, i)) + chart.fn_angleScale.bandwidth()

    const fn_innerRadius = (d, i) => !isNaN(self._fn_bottomValue(d, i))
      ? chart.fn_radiusScale(self._fn_bottomValue(d, i))
      : chart.fn_radiusScale.range()[0]
    const fn_outerRadius = (d, i) => chart.fn_radiusScale(self._fn_topValue(d, i))

    self._fn_draw = (sectorBars, transition) => {
      self._join = sectorBars.join(
        enter => enter
          .append('path')
          .attr('stroke', self._fn_stroke)
          .attr('stroke-width', self._fn_strokeWidth)
          .attr('fill', self._fn_fill)
          .attr('fill-opacity', self._fn_fillOpacity)
          .attr('opacity', 0)
          .each((d, i, nodes) => {
            const selection = d3.select(nodes[i])
            selection
              .attr('startAngleInitial', fn_startAngle(d, i))
              .attr('startAngle', fn_startAngle(d, i))
              .attr('endAngleInitial', fn_endAngle(d, i))
              .attr('endAngle', fn_endAngle(d, i))
              .attr('innerRadiusInitial', fn_innerRadius(d, i))
              .attr('innerRadius', fn_innerRadius(d, i))
              .attr('outerRadiusInitial', fn_innerRadius(d, i)) // INNER HERE (NOT OUTER)
              .attr('outerRadius', fn_outerRadius(d, i))
          })
          .call(enter =>
            self.multiTransition(enter, transition)
              .attrTween('d', self._fn_arcTween)
              .attr('opacity', self._fn_opacity)),
        update => update
          .each((d, i, nodes) => {
            const selection = d3.select(nodes[i])
            selection
              .attr('startAngleInitial', selection.attr('startAngle'))
              .attr('startAngle', fn_startAngle(d, i))
              .attr('endAngleInitial', selection.attr('endAngle'))
              .attr('endAngle', fn_endAngle(d, i))
              .attr('innerRadiusInitial', selection.attr('innerRadius'))
              .attr('innerRadius', fn_innerRadius(d, i))
              .attr('outerRadiusInitial', selection.attr('outerRadius'))
              .attr('outerRadius', fn_outerRadius(d, i))
          })
          .call(update =>
            update.transition(transition)
              .attrTween('d', self._fn_arcTween)
              .attr('fill', self._fn_fill)
              .attr('fill-opacity', self._fn_fillOpacity)
              .attr('opacity', self._fn_opacity)),
        exit => exit
          .each((d, i, nodes) => {
            const selection = d3.select(nodes[i])
            selection
              .attr('startAngleInitial', selection.attr('startAngle'))
            // .attr("startAngle",selection.attr("startAngle"))
              .attr('endAngleInitial', selection.attr('endAngle'))
            // .attr("endAngle", selection.attr("endAngle"))
              .attr('innerRadiusInitial', selection.attr('innerRadius'))
            // .attr("innerRadius", selection.attr("innerRadius"))
              .attr('outerRadiusInitial', selection.attr('outerRadius'))
              .attr('outerRadius', fn_innerRadius(d, i)) // INNER HERE (NOT OUTER)
          })
          .call(exit =>
            self.multiTransition(exit, transition)
              .attrTween('d', self._fn_arcTween)
              .attr('opacity', 0)
              .remove())
      )
    }

    return self
  }

  /**
   * @override
   */
  draw (transition) {
    super.draw(transition)

    const self = this

    self._group.classed('sector-bars', true)

    self._group.selectAll('path')
      .data(self._chart.data.filter(self._fn_defined), self._chart.fn_key)
      .call(self._fn_draw, transition)

    return self
  }
}
