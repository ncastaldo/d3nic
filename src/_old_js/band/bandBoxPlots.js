import * as d3 from '@/js/d3-modules.js'
import Component from '@/js/component.js'

export default class BandBoxPlots extends Component {
  constructor (params = {}) {
    super(params)

    const self = this

    self._fn_maxWidth = params.fn_maxWidth || ((d, i) => Number.POSITIVE_INFINITY)
    self._fn_minWidth = params.fn_minWidth || ((d, i) => 0)

    self._fn_minValue = params.fn_minValue || ((d, i) => d)
    self._fn_q1Value = params.fn_q1Value || ((d, i) => d)
    self._fn_medianValue = params.fn_medianValue || ((d, i) => d)
    self._fn_q3Value = params.fn_q3Value || ((d, i) => d)
    self._fn_maxValue = params.fn_maxValue || ((d, i) => d)

    self._fn_valueDomain = (data) => d3.extent(
      data.map((d, i) => [
        self._fn_minValue(d, i),
        self._fn_maxValue(d, i)
      ]).flat()
    )
  }

  /**
   * @override
   */
  set chart (chart) {
    super.chart = chart

    const self = this

    const fn_bandwidth = chart.fn_bandScale.bandwidth

    const fn_x = (d, i) => chart.fn_bandScale(chart.fn_key(d, i))
    const fn_width = (d, i) => fn_bandwidth() > self._fn_maxWidth(d, i)
      ? self._fn_maxWidth(d, i)
      : fn_bandwidth() < self._fn_minWidth(d, i)
        ? self._fn_minWidth(d, i)
        : fn_bandwidth()

    const fn_yMin = (d, i) => chart.fn_yScale(self._fn_minValue(d, i))
    const fn_yQ1 = (d, i) => chart.fn_yScale(self._fn_q1Value(d, i))
    const fn_yMedian = (d, i) => chart.fn_yScale(self._fn_medianValue(d, i))
    const fn_yQ3 = (d, i) => chart.fn_yScale(self._fn_q3Value(d, i))
    const fn_yMax = (d, i) => chart.fn_yScale(self._fn_maxValue(d, i))

    const fn_newYMin = (d, i) => Math.abs(fn_yMedian(d, i) - fn_yMin(d, i))
    const fn_newYQ1 = (d, i) => Math.abs(fn_yMedian(d, i) - fn_yQ1(d, i))
    const fn_newYQ3 = (d, i) => -Math.abs(fn_yMedian(d, i) - fn_yQ3(d, i))
    const fn_newYMax = (d, i) => -Math.abs(fn_yMedian(d, i) - fn_yMax(d, i))

    const enterRect = (enter, transition) => enter
      .append('rect')
      .attr('x', (d, i) => -fn_width(d, i) / 2)
      .attr('width', fn_width)
      .attr('y', 0)
      .attr('height', 0)
      .call(enter =>
        self.multiTransition(enter, transition)
          .attr('y', fn_newYQ3)
          .attr('height', (d, i) => Math.abs(fn_yQ3(d, i) - fn_yQ1(d, i))))
    const updateRect = (update, transition) => update
      .select('rect')
      .call(update => update
        .transition(transition)
        .attr('x', (d, i) => -fn_width(d, i) / 2)
        .attr('width', fn_width)
        .attr('y', fn_newYQ3)
        .attr('height', (d, i) => Math.abs(fn_yQ3(d, i) - fn_yQ1(d, i))))
    const exitRect = (exit, transition) => exit
      .select('rect')
      .call(exit =>
        self.multiTransition(exit, transition)
          .attr('y', 0)
          .attr('height', 0)
          .remove())

    const enterHLine = (enter, transition, type) =>
      enter
        .append('line')
        .classed(type, true)
        .attr('x1', (d, i) => -fn_width(d, i) / 2)
        .attr('x2', (d, i) => fn_width(d, i) / 2)
        .attr('y1', 0)
        .attr('y2', 0)
        .call(enter =>
          self.multiTransition(enter, transition)
            .attr('y1', type === 'h-bottom' ? fn_newYMin : type === 'h-top' ? fn_newYMax : 0)
            .attr('y2', type === 'h-bottom' ? fn_newYMin : type === 'h-top' ? fn_newYMax : 0)
        )
    const updateHLine = (update, transition, type) =>
      update
        .select(`line.${type}`)
        .transition(transition)
        .attr('x1', (d, i) => -fn_width(d, i) / 2)
        .attr('x2', (d, i) => fn_width(d, i) / 2)
        .attr('y1', type === 'h-bottom' ? fn_newYMin : type === 'h-top' ? fn_newYMax : 0)
        .attr('y2', type === 'h-bottom' ? fn_newYMin : type === 'h-top' ? fn_newYMax : 0)
    const exitHLine = (exit, transition, type) =>
      exit
        .select(`line.${type}`)
        .call(exit =>
          self.multiTransition(exit, transition)
            .attr('y1', 0)
            .attr('y2', 0)
            .remove()
        )

    const enterVLine = (enter, transition, type) =>
      enter
        .append('line')
        .classed(type, true)
        .attr('x1', 0)
        .attr('x2', 0)
        .attr('y1', 0)
        .attr('y2', 0)
        .call(enter =>
          self.multiTransition(enter, transition)
            .attr('y1', type === 'v-bottom' ? fn_newYQ1 : fn_newYQ3)
            .attr('y2', type === 'v-bottom' ? fn_newYMin : fn_newYMax)
        )
    const updateVLine = (update, transition, type) =>
      update
        .select(`line.${type}`)
        .transition(transition)
        .attr('y1', type === 'v-bottom' ? fn_newYQ1 : fn_newYQ3)
        .attr('y2', type === 'v-bottom' ? fn_newYMin : fn_newYMax)
    const exitVLine = (exit, transition, type) =>
      exit
        .select(`line.${type}`)
        .call(exit =>
          self.multiTransition(exit, transition)
            .attr('y1', 0)
            .attr('y2', 0)
            .remove()
        )

    self._fn_draw = (boxPlots, transition) => {
      self._join = boxPlots.join(
        enter => enter
          .append('g')
          .classed('band-box-plot', true)
          .attr('fill', self._fn_fill)
          .attr('fill-opacity', self._fn_fillOpacity)
          .attr('stroke', self._fn_stroke)
          .attr('stroke-width', self._fn_strokeWidth)
          .attr('opacity', 0)
          .attr('transform', (d, i) => `translate(${fn_x(d, i) + fn_bandwidth() / 2}, ${fn_yMedian(d, i)})`)
          .call(enterRect, transition)
          .call(enterHLine, transition, 'h-center')
          .call(enterHLine, transition, 'h-bottom')
          .call(enterVLine, transition, 'v-bottom')
          .call(enterHLine, transition, 'h-top')
          .call(enterVLine, transition, 'v-top')
          .call(enter => self.multiTransition(enter, transition)
            .attr('opacity', self._fn_opacity)
          ),
        update => update
          .call(updateRect, transition)
          .call(updateHLine, transition, 'h-center')
          .call(updateHLine, transition, 'h-bottom')
          .call(updateVLine, transition, 'v-bottom')
          .call(updateHLine, transition, 'h-top')
          .call(updateVLine, transition, 'v-top')
          .call(update => update
            .transition(transition)
            .attr('transform', (d, i) => `translate(${fn_x(d, i) + fn_bandwidth(d, i) / 2}, ${fn_yMedian(d, i)})`)
            .attr('opacity', self._fn_opacity)
          ),
        exit => exit
          .call(exitRect, transition)
          .call(exitHLine, transition, 'h-center')
          .call(exitHLine, transition, 'h-bottom')
          .call(exitVLine, transition, 'v-bottom')
          .call(exitHLine, transition, 'h-top')
          .call(exitVLine, transition, 'v-top')
          .call(exit =>
            self.multiTransition(exit, transition)
              .attr('opacity', 0)
              .remove())
      )
    }
  }

  /**
   * @override
   */
  draw (transition) {
    super.draw(transition)

    const self = this

    self._group.classed('band-box-plots', true)

    self._group
      .selectAll('g.band-box-plot')
      .data(self._chart.data.filter(self._fn_defined), self._chart.fn_key)
      .call(self._fn_draw, transition)
  }
}
