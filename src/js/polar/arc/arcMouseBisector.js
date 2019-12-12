import * as d3 from '@/js/d3-modules.js'
import Component from '@/js/component.js'

export default class ArcMouseBisector extends Component {
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

      const radius = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))

      const key = mouseScale(radius)

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
      const correction = (chart.fn_radiusScale.paddingInner() / 2 - chart.fn_radiusScale.paddingOuter()) * chart.fn_radiusScale.step()

      const [radius0, radius1] = chart.fn_radiusScale.range()

      const mouseScaleDomain = [
        radius0 - correction,
        radius1 + correction
      ]

      mouseScale.domain(mouseScaleDomain)
        .range(chart.fn_radiusScale.domain())

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

    self._group.classed('arc-mouse-bisector', true)

    self._group
      .selectAll('path')
      .data([null])
      .call(self._fn_draw, transition)
  }
}
