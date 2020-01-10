import * as d3 from '@/js/d3-modules.js'
import Component from '@/js/component.js'

export default class XySymbols extends Component {
  constructor (params = {}) {
    super(params)

    const self = this

    self._fn_type = params.fn_type || ((d, i) => d3.symbolCircle)
    self._fn_size = params.fn_size || ((d, i) => 3)

    self._fn_value = params.fn_value || ((d, i) => d)
    self._fn_valueDomain = (data) => d3.extent(data, self._fn_value)
  }

  /**
   * @override
   */
  set chart (chart) {
    super.chart = chart

    const self = this

    self._fn_path2D = d3.symbol()

    self._fn_x = (d, i) => chart.fn_xScale(chart.fn_key(d, i))
    self._fn_y = (d, i) => chart.fn_yScale(self._fn_value(d, i))
    self._fn_path = (d, i) => self._fn_path2D
      .type(self._fn_type(d, i))
      .size(self._fn_size(d, i))(self._fn_value(d, i))

    const fn_pathInitial = (d, i) => d3.symbol().type(self._fn_type(d, i)).size(1)()

    self._fn_draw = (symbols, transition) => {
      self._join = symbols.join(
        enter =>
          enter
            .append('path')
            .attr('stroke', self._fn_stroke)
            .attr('stroke-width', self._fn_strokeWidth)
            .attr('fill', self._fn_fill)
            .attr('transform', (d, i) => `translate(${self._fn_x(d, i)}, ${self._fn_y(d, i)})`)
            .attr('d', fn_pathInitial)
            .attr('opacity', 0)
            .call(self._fn_enter)
            .call(enter => {
              self.multiTransition(enter, transition)
                .attr('opacity', self._fn_opacity)
                .attr('d', self._fn_path)
            }),
        update =>
          update.call(update =>
            update
              .transition(transition)
              .attr('transform', (d, i) => `translate(${self._fn_x(d, i)}, ${self._fn_y(d, i)})`)
              .attr('opacity', self._fn_opacity)
              .attr('d', self._fn_path)
          ),
        exit =>
          exit.call(exit =>
            self.multiTransition(exit, transition)
              .attr('opacity', 0)
              .attr('d', fn_pathInitial)
              .remove()
          )
      )
    }
  }

  /**
   * @override
   */
  draw (transition) {
    super.draw(transition)

    const self = this

    self._group.classed('xy-symbols', true)

    self._group
      .selectAll('path')
      .data(self._chart.data.filter(self._fn_defined), self._chart.fn_key)
      .call(self._fn_draw, transition)
  }
}
