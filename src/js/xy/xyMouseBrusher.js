import * as d3 from '@/js/d3-modules.js'
import Component from '@/js/component.js'

export default class XyMouseBrusher extends Component {
  constructor (params = {}) {
    super(params)

    const self = this

    self._brushFill = params.brushFill || d3.schemeBlues[5][3]
    self._brushFillOpacity = params.brushFillOpacity || 0.1

    self._fn_onBrushAction = params.fn_onBrushAction || (dataBrush => {})
    self._fn_onEndAction = params.fn_onEndAction || (dataBrush => {})
  }

  /**
   * @override
   */
  set chart (chart) {
    super.chart = chart

    const self = this

    const mouseScale = d3.scaleQuantize()
    const fn_brush = d3.brushX()

    let brushKeys
    let change

    self._fn_draw = (brush, transition) => {
      const halfStep = chart.fn_xScale.step() / 2
      mouseScale.domain(chart.fn_xScale.range()).range(chart.fn_xScale.domain())

      const fn_onBrush = (d, i, nodes) => {
        if (d3.event.sourceEvent.type !== 'mousemove') return // Only transition after input.

        let brushPainted = false

        // HANDLE THE ADJUSTMENTS
        const mouseExtent = d3.brushSelection(nodes[i])
        if ((mouseExtent[1] - mouseExtent[0]) > halfStep) { // to limit overhead
          const key0 = mouseScale(mouseExtent[0] + halfStep)
          const key1 = mouseScale(mouseExtent[1] - halfStep)
          if (key1 >= key0) {
            brushPainted = true
            change = !brushKeys || brushKeys[0] !== key0 || brushKeys[1] !== key1
            brushKeys = [key0, key1]
            const correctMouseExtent = [mouseScale.invertExtent(key0)[0], mouseScale.invertExtent(key1)[1]]
            d3.select(nodes[i]).call(fn_brush.move, correctMouseExtent)
          }
        }

        if (!brushPainted) {
          change = brushKeys // if before defined then change now
          brushKeys = undefined // brushing to NaN, NaN
          d3.select(nodes[i]).call(fn_brush.move, [0, 0])
        }

        // HANDLE THE CHANGES
        if (change) {
          self._fn_onBrushAction(brushKeys)
        }
      }

      const fn_onEnd = (d, i, nodes) => {
        if (d3.event.sourceEvent.type !== 'mouseup') return // Only transition after input.

        const mouseExtent = d3.brushSelection(nodes[i])

        if (!mouseExtent) {
          d3.select(nodes[i]).call(fn_brush.move, [0, 0])
          brushKeys = d3.extent(chart.fn_xScale.domain())
          self._fn_onBrushAction(brushKeys)
        }

        self._fn_onEndAction(brushKeys)
      }

      // i0Last = 0
      // i1Last = dataBrush.length - 1 // attention if no data...

      fn_brush.on('brush', fn_onBrush)
      fn_brush.on('end', fn_onEnd)

      fn_brush.extent([
        [chart.fn_xScale.range()[0], chart.fn_yScale.range()[1]],
        [chart.fn_xScale.range()[1], chart.fn_yScale.range()[0]]
      ])

      brush.call(fn_brush)

      brush.selectAll('rect')
        .attr('height', chart.fn_yScale.range()[1] + chart.fn_yScale.range()[0])
        .attr('y', chart.fn_yScale.range()[1])

      brush.select('rect.selection')
        .attr('fill', self._brushFill)
        .attr('fill-opacity', self._brushFillOpacity)
        .attr('stroke', '')
    }
  }

  /**
   * @override
   */
  draw (transition) {
    super.draw(transition)

    const self = this

    self._group.classed('xy-mouse-brusher', true)

    self._group.call(self._fn_draw, transition)
  }
}
