import * as d3 from '@/js/d3-modules.js'
import Component from '@/js/component.js'

export default class BandMouseBrusher extends Component {
  constructor (params = {}) {
    super(params)

    const self = this

    self._fn_brush = d3.brushX() // to init
    self._mouseScale = d3.scaleQuantize()

    self._brushKeys = 'brushKeys' in params ? params.brushKeys : undefined
    self._proactive = 'proactive' in params ? params.proactive : false

    self._brushFill = params.brushFill || d3.schemeBlues[5][3]
    self._brushFillOpacity = params.brushFillOpacity || 0.1

    self._fn_onBrushAction = params.fn_onBrushAction || (dataBrush => {})
    self._fn_onEndAction = params.fn_onEndAction || (dataBrush => {})
  }

  get brushKeys () {
    const self = this
    return self._brushKeys
  }

  set brushKeys (brushKeys) {
    const self = this
    const snap = !self._brushKeys || self._brushKeys[0] !== brushKeys[0] || self._brushKeys[1] !== brushKeys[1]
    self._brushKeys = brushKeys
    self._group && snap && self.snapBrush(self)
  }

  snapBrush (self) {
    const mouseExtent = self._brushKeys && (
      self._brushKeys[0] !== self._mouseScale.range()[0] ||
        self._brushKeys[1] !== self._mouseScale.range().slice(-1)[0] // last
    )
      ? [self._mouseScale.invertExtent(self._brushKeys[0])[0], self._mouseScale.invertExtent(self._brushKeys[1])[1]]
      : [0, 0]
    console.log(mouseExtent)
    self._group.call(self._fn_brush.move, mouseExtent)
  }

  /**
   * @override
   */
  set chart (chart) {
    super.chart = chart

    const self = this

    let change

    const fn_onBrush = (d, i, nodes) => {
      if (!d3.event.sourceEvent || d3.event.sourceEvent.type !== 'mousemove') return // Only transition after input.

      let brushPainted = false

      // HANDLE THE ADJUSTMENTS
      const [x0, x1] = d3.brushSelection(self._group.node())
      if (x1 - x0 > chart.fn_bandScale.step() / 2) { // to limit overhead
        const key0 = self._mouseScale(x0 + chart.fn_bandScale.step() / 2)
        const key1 = self._mouseScale(x1 - chart.fn_bandScale.step() / 2)
        if (key1 >= key0) {
          brushPainted = true
          change = !self.brushKeys || self._brushKeys[0] !== key0 || self._brushKeys[1] !== key1
          self._brushKeys = [key0, key1]
          self._proactive && self.snapBrush(self)
        }
      }

      if (!brushPainted) {
        change = self._brushKeys // if before defined then change now, only once
        self._brushKeys = undefined // brushing to NaN, NaN
        self._proactive && self.snapBrush(self)
      }

      // HANDLE THE CHANGES
      if (change) {
        self._fn_onBrushAction(self._brushKeys)
      }
    }

    const fn_onEnd = (d, i, nodes) => {
      if (!d3.event.sourceEvent || d3.event.sourceEvent.type !== 'mouseup') return // Only transition after input.

      const mouseExtent = d3.brushSelection(self._group.node())
      const removeBrush = !self._brushKeys || !mouseExtent || (mouseExtent[1] - mouseExtent[0]) < chart.fn_bandScale.step() / 2

      if (removeBrush) {
        self._group.call(self._fn_brush.move, [0, 0])
        self._brushKeys = d3.extent(chart.fn_bandScale.domain())
        self._fn_onBrushAction(self._brushKeys)
      }

      self._fn_onEndAction(self._brushKeys)
      !removeBrush && !self._proactive && self.snapBrush(self)
    }

    self._fn_brush.on('brush', fn_onBrush)
    self._fn_brush.on('end', fn_onEnd)

    self._fn_draw = (group, transition) => {
      self._mouseScale.domain(chart.fn_bandScale.range()).range(chart.fn_bandScale.domain())

      self._fn_brush.extent([
        [chart.fn_bandScale.range()[0], chart.fn_yScale.range()[1]],
        [chart.fn_bandScale.range()[1], chart.fn_yScale.range()[0]]
      ])

      group.call(self._fn_brush)

      group.selectAll('rect')
        .attr('height', chart.fn_yScale.range()[0] - chart.fn_yScale.range()[1])
        .attr('y', chart.fn_yScale.range()[1])

      group.select('rect.selection')
        .attr('fill', self._brushFill)
        .attr('fill-opacity', self._brushFillOpacity)
        .attr('stroke', '')

      self.snapBrush(self)
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
