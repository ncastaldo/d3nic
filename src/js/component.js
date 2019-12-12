import * as d3 from '@/js/d3-modules.js'

export default class Component {
  constructor (params = {}) {
    const self = this

    self._chart = undefined
    self._group = undefined

    self._fn_path2D = (d, i) => {}

    self._fn_path = (d, i) => ''
    self._fn_x = (d, i) => 0
    self._fn_y = (d, i) => 0

    self._fn_stroke = params.fn_stroke || ((d, i) => 'black')
    self._fn_strokeDasharray = params.fn_strokeDasharray || ((d, i) => [0, 0])
    self._fn_strokeWidth = params.fn_strokeWidth || ((d, i) => 1)
    self._fn_fill = params.fn_fill || ((d, i) => 'red')
    self._fn_fillOpacity = params.fn_fillOpacity || ((d, i) => 1)
    self._fn_opacity = params.fn_opacity || ((d, i) => 1)

    self._fn_defined = params.fn_defined || ((d, i) => true)

    self._fn_valueDomain = (data) => [NaN, NaN] // might be replaced in components

    self._fn_enter = params.fn_enter || (enter => {})
    self._fn_update = params.fn_update || (update => {})
    self._fn_exit = params.fn_exit || (exit => {})

    self._componentData = []
  }

  get fn_valueDomain () {
    const self = this
    return self._fn_valueDomain
  }

  get fn_defined () {
    const self = this
    return self._fn_defined
  }

  get chart () {
    const self = this
    return self._chart
  }

  set chart (chart) {
    const self = this
    self._chart = chart
  }

  get group () {
    const self = this
    return self._group
  }

  get componentData () {
    const self = this
    return self._componentData
  }

  get join () {
    const self = this
    return self._join || d3.select(null)
  }

  // may be overridden in cases in which data is modified
  setComponentData (self) {
    self._componentData = self._chart.data.filter(self._fn_defined)
  }

  drawCanvas () {
    const self = this

    const context = self._chart.context
    const regex = /translate\((-?\d+\.?\d*),?\s*(-?\d+[.]?\d*)?\)/

    self._fn_path2D.context && self._fn_path2D.context(context)

    context.lineJoin = 'round'
    context.lineCap = 'round'

    const fn_renderNodes = (d, i, nodes) => {
      const s = d3.select(nodes[i])

      const t = regex.exec(s.attr('transform')) || []
      const x = t.length > 1 ? t[1] : 0
      const y = t.length > 2 ? t[2] : 0
      const lineWidth = parseInt(s.attr('stroke-width') || 0)
      const fillOpacity = parseInt(s.attr('fill-opacity') || 0)

      const path = new Path2D(s.attr('d'))

      context.save()

      context.translate(x, y)

      context.beginPath()

      context.globalAlpha = s.attr('opacity')

      if (lineWidth) {
        context.lineWidth = lineWidth
        context.strokeStyle = s.attr('stroke')
        context.stroke(path)
      }

      if (fillOpacity) {
        context.fillStyle = s.attr('fill')
        context.fill(path)
      }

      context.restore()
    }

    const fn_renderData = (d, i) => {
      const x = self._fn_x(d, i)
      const y = self._fn_y(d, i)
      const lineWidth = self._fn_strokeWidth(d, i)
      const fillOpacity = self._fn_fillOpacity(d, i)

      context.save()

      context.translate(x, y)

      context.beginPath()

      context.globalAlpha = self._fn_opacity(d, i)

      const svgPath = self._fn_path(d, i)
      const path = svgPath ? new Path2D(svgPath) : null

      if (lineWidth) {
        context.lineWidth = lineWidth
        context.strokeStyle = self._fn_stroke(d, i)
        context.stroke(path)
      }

      if (fillOpacity) {
        context.fillStyle = self._fn_fill(d, i)
        context.fill(path)
      }

      context.restore()
    }

    if (self._group) { // if there is some svg to render
      self._join.each(fn_renderNodes)
    } else { // otherwise render directly from data
      self.setComponentData(self)
      self._componentData.forEach(fn_renderData)
    }
  }

  draw (transition) {
    const self = this

    self.setComponentData(self)

    self._fn_path2D.context && self._fn_path2D.context(null)

    // appending the group
    if (!self._group) {
      self._group = self._chart.group
        .append('g')
        .classed('component', true)
    }
  }
}
