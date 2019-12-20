import * as d3 from '@/js/d3-modules.js'
import Component from '@/js/component.js'

export default class XyMouseBisector extends Component {
  constructor (params = {}) {
    super(params)

    const self = this

    self._fn_onMouseenterAction = params.fn_onMouseenterAction || (() => {})
    self._fn_onMouseoverAction = params.fn_onMouseoverAction || ((d) => {})
    self._fn_onMouseoutAction = params.fn_onMouseoutAction || ((d) => {})
    self._fn_onMouseleaveAction = params.fn_onMouseleaveAction || (() => {})
  }

  /**
   * @override
   */
  set chart (chart) {
    super.chart = chart

    const self = this

    let last

    const mouseScale = d3.scaleQuantize()

    const fn_onMouseenter = () => {
      self._fn_onMouseenterAction()
    }

    const fn_onMousemove = (_, i, nodes) => {
      const x = d3.mouse(nodes[i])[0]

      const d = mouseScale(x)

      if (d !== last) {
        if (last !== null) self._fn_onMouseoutAction(last)

        self._fn_onMouseoverAction(d)

        last = d
      }
    }

    const fn_onMouseleave = () => {
      self._fn_onMouseoutAction(last)
      self._fn_onMouseleaveAction()
      last = null
    }

    self._fn_draw = (group, transition) => {
      const correction = (chart.fn_xScale.paddingInner() / 2 - chart.fn_xScale.paddingOuter()) * chart.fn_xScale.step()

      const mouseScaleDomain = [
        chart.fn_xScale.range()[0] - correction,
        chart.fn_xScale.range()[1] + correction
      ]

      mouseScale.domain(mouseScaleDomain)
        .range(self._componentData)

      const x0 = chart.fn_xScale.range()[0]
      const x1 = chart.fn_xScale.range()[1]
      const y0 = chart.fn_yScale.range()[1] // reversed
      const y1 = chart.fn_yScale.range()[0]

      self._join = group.join(
        enter => enter
          .append('rect')
          .attr('x', x0)
          .attr('width', x1 - x0)
          .attr('y', y0)
          .attr('height', y1 - y0)
          .attr('opacity', 0)
          .on('mouseenter.mouse-bisector', fn_onMouseenter)
          .on('mousemove.mouse-bisector', fn_onMousemove)
          .on('mouseleave.mouse-bisector', fn_onMouseleave)
          .call(self._fn_enter),
        update => update
          .attr('x', x0)
          .attr('width', x1 - x0)
          .attr('y', y0)
          .attr('height', y1 - y0)
          .call(self._fn_update),
        exit => exit
          .attr('opacity', 0)
          .call(self._fn_exit)
          .remove()
      )
    }
  }

  /**
   * @override
   */
  draw (transition) {
    super.draw(transition)

    const self = this

    self._group.classed('xy-mouse-bisector', true)

    self._group
      .selectAll('rect')
      .data([null])
      .call(self._fn_draw, transition)
  }
}
