import * as d3 from '@/js/d3-modules.js'
import Component from '@/js/component.js'

export default class SectorMouseBisector extends Component {
  constructor (params = {}) {
    super(params)

    const self = this

    self._fn_onMouseenterAction = params.fn_onMouseenterAction || (() => {})
    self._fn_onMouseoverAction = params.fn_onMouseoverAction || ((key) => {})
    self._fn_onMouseoutAction = params.fn_onMouseoutAction || ((key) => {})
    self._fn_onMouseleaveAction = params.fn_onMouseleaveAction || (() => {})
  }

  /**
   * @override
   */
  set chart (chart) {
    super.chart = chart

    const self = this

    let lastKey

    const mouseScale = d3.scaleQuantize()

    const fn_onMouseenter = () => {
      self._fn_onMouseenterAction()
    }

    const fn_onMousemove = (d, i, nodes) => {
      const [x, y] = d3.mouse(nodes[i])

      console.log(`${x} - ${y}`)

      /*
      const key = mouseScale(x)

      if (key !== lastKey) {
        if (lastKey !== null) self._fn_onMouseoutAction(lastKey)

        self._fn_onMouseoverAction(key)

        lastKey = key
      } */
    }

    const fn_onMouseleave = () => {
      self._fn_onMouseoutAction(lastKey)
      self._fn_onMouseleaveAction()
      lastKey = null
    }

    const fn_arc = d3.arc()

    self._fn_draw = (group, transition) => {
      /* const correction = (chart.fn_xScale.paddingInner() / 2 - chart.fn_xScale.paddingOuter()) * chart.fn_xScale.step()

      const mouseScaleDomain = [
        chart.fn_xScale.range()[0] - correction,
        chart.fn_xScale.range()[1] + correction
      ]

      mouseScale.domain(mouseScaleDomain)
        .range(chart.fn_xScale.domain())

      const x0 = chart.fn_xScale.range()[0]
      const x1 = chart.fn_xScale.range()[1]
      const y0 = chart.fn_yScale.range()[1] // reversed
      const y1 = chart.fn_yScale.range()[0]

      */

      fn_arc
        .innerRadius(d3.min(chart.fn_radiusScale.range()))
        .outerRadius(d3.max(chart.fn_radiusScale.range()))
        .startAngle(chart.fn_angleScale.range()[0])
        .endAngle(chart.fn_angleScale.range()[1])

      self._join = group.join(
        enter => enter
          .append('path')
          .attr('d', fn_arc)
          .attr('opacity', 0)
          .on('mouseenter.mouse-bisector', fn_onMouseenter)
          .on('mousemove.mouse-bisector', fn_onMousemove)
          .on('mouseleave.mouse-bisector', fn_onMouseleave)
          .call(self._fn_enter),
        update => update
          .attr('d', fn_arc)
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
      .selectAll('path')
      .data([null])
      .call(self._fn_draw, transition)
  }
}
