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
      .tickFormat(self._xTickFormat)
      .tickSize(0)
      .tickPadding(8)

    const fn_xAxisTransform = () => `translate(0, ${chart.fn_yScale.range()[0]})`

    const fn_yAxis = d3
      .axisLeft()
      .scale(chart.fn_yScale)
      .ticks(self._yTicks)
      .tickFormat(self._yTickFormat)
      .tickSizeOuter(0)

    const fn_yAxisTransform = () => `translate(${chart.fn_xScale.range()[0]}, 0)`

    const fn_recursive = (tot, max, j) => {
      if (tot / j <= max) return j
      return fn_recursive(tot, max, j + 1)
    }

    const fn_tickValues = () => {
      const domain = chart.fn_xScale.domain()
      if (self._xTicks <= 0) return domain
      const j = fn_recursive(domain.length, self._xTicks, 1)
      const correction = Math.floor((domain.length - 1) % j / 2) // how many on the right -> shift in case
      const fn_filter = (d, i) => i % j === correction
      return domain.filter(fn_filter)
    }

    self._fn_draw = (group, transition) => {

      if (self._xAxisVisible) {
        fn_xAxis.tickValues(fn_tickValues())

        self._xAxis = self._xAxis || group.append('g')

        const firstTime = !self._xAxis.classed('x-axis')
        self._xAxis.classed('axis x-axis', true)

        self._xAxis
          .call(axis => {
            firstTime && axis.attr('opacity', 0).attr('transform', fn_xAxisTransform)
          })
          .transition(transition)
          .attr('transform', fn_xAxisTransform)
          .attr('opacity', self._fn_opacity)
          .call(fn_xAxis)
      }

      if (self._yAxisVisible) {
        self._yAxis = self._yAxis || group.append('g')

        const firstTime = !self._yAxis.classed('y-axis')
        self._yAxis.classed('axis y-axis', true)

        self._yAxis
          .call(axis => {
            firstTime && axis.attr('opacity', 0).attr('transform', fn_yAxisTransform)
          })
          .transition(transition)
          .attr('transform', fn_yAxisTransform)
          .attr('opacity', self._fn_opacity)
          .call(fn_yAxis)
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
