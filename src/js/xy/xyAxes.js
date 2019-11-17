import * as d3 from '@/js/d3-modules.js'
import Component from '@/js/component.js'

export default class XyAxes extends Component {
  constructor (params = {}) {
    super(params)

    const self = this

    self._xAxisVisible = 'xAxisVisible' in params ? params.xAxisVisible : true
    self._yAxisVisible = 'yAxisVisible' in params ? params.yAxisVisible : true

    self._xTicks = 'xTicks' in params ? params.xTicks : 5
    self._yTicks = 'yTicks' in params ? params.yTicks : 5

    self._xTickFormat = params.xTickFormat || d3.format('.0f')
    self._yTickFormat = params.yTickFormat || d3.format('.0f')

    return self
  }

  /**
   * @override
   */
  set chart (chart) {
    super.chart = chart

    const self = this

    const fn_xAxis = d3
      .axisBottom()
      .scale(chart.fn_xScale)
      .ticks(self._xTicks)
      .tickFormat(self._xTickFormat)
      .tickSizeInner(0)
      .tickSizeOuter(0)
      .tickPadding(8)

    const fn_yAxis = d3
      .axisLeft()
      .scale(chart.fn_yScale)
      .ticks(self._yTicks)
      .tickFormat(self._yTickFormat)
      .tickSizeOuter(0)

    self._fn_draw = (axes, transition) => {
      if (self._xAxisVisible) {
        const xAxis = axes.select('g.axis.x-axis')
        if (!xAxis.empty()) {
          xAxis.transition(transition)
            .attr(
              'transform', `translate(0, ${chart.fn_yScale.range()[0]})`
            )
            .call(fn_xAxis)
        } else {
          axes.append('g').classed('axis x-axis', true)
            .attr(
              'transform', `translate(0, ${chart.fn_yScale.range()[0]})`
            )
            .call(fn_xAxis)
            .attr('opacity', 0)
            .transition(transition)
            .attr('opacity', 1)
        }
      }

      if (self._yAxisVisible) {
        const yAxis = axes.select('g.axis.y-axis')

        if (!yAxis.empty()) {
          yAxis.transition(transition)
            .attr(
              'transform', `translate(${chart.fn_xScale.range()[0]}, 0)`
            )
            .call(fn_yAxis)
        } else {
          axes.append('g').classed('axis y-axis', true)
            .attr(
              'transform', `translate(${chart.fn_xScale.range()[0]}, 0)`
            )
            .call(fn_yAxis)
            .attr('opacity', 0)
            .transition(transition)
            .attr('opacity', 1)
        }
      }
    }
  }

  /**
   * @override
   */
  draw (transition) {
    super.draw(transition)

    const self = this

    self._group.classed('xy-axes', true)
    self._group.call(self._fn_draw, transition)
  }
}
