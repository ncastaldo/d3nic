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

    const HALF_PI = Math.PI / 2

    let clockwise
    let lastKey

    const mouseScale = d3.scaleQuantize()

    const fn_onMouseenter = () => {
      self._fn_onMouseenterAction()
    }

    const fn_onMousemove = (d, i, nodes) => {
      const [x, y] = d3.mouse(nodes[i])

      // 0 if top-right, 1 if bottom-right and so on clockwise
      const multiplier = y < 0 ? (x > 0 ? 0 : 3) : (x > 0 ? 1 : 2)

      // multiple of Math.PI / 2 angle to be added to miniAngle
      const addAngle = HALF_PI * multiplier

      // miniAngle, calculated clockwise, between 0 and Math.PI/2
      const miniAngle = multiplier % 2 === 0 // if top-right or bottom-left
        ? y ? Math.atan(Math.abs(x / y)) : HALF_PI
        : x ? Math.atan(Math.abs(y / x)) : HALF_PI

      // angle calculated clockwise from vertical line of top-right quadrant
      const angle = addAngle + miniAngle
      const key = mouseScale(clockwise ? angle : Math.PI * 2 - angle)

      if (key !== lastKey) {
        if (lastKey !== null) self._fn_onMouseoutAction(lastKey)

        self._fn_onMouseoverAction(key)

        lastKey = key
      }
    }

    const fn_onMouseleave = () => {
      self._fn_onMouseoutAction(lastKey)
      self._fn_onMouseleaveAction()
      lastKey = null
    }

    const fn_arc = d3.arc()

    self._fn_draw = (group, transition) => {
      const correction = (chart.fn_angleScale.paddingInner() / 2 - chart.fn_angleScale.paddingOuter()) * chart.fn_angleScale.step()

      const [angle0, angle1] = chart.fn_angleScale.range()

      clockwise = angle1 > angle0

      const mouseScaleDomain = clockwise ? [
        angle0 - correction,
        angle1 + correction
      ] : [
        angle1 - correction,
        angle0 + correction
      ]

      mouseScale.domain(mouseScaleDomain)
        .range(chart.fn_angleScale.domain())

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

    self._group.classed('sector-mouse-bisector', true)

    self._group
      .selectAll('path')
      .data([null])
      .call(self._fn_draw, transition)
  }
}
