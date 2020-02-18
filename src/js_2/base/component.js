import * as d3 from '@/js/d3-modules.js'

import { hasRegistry } from '../common'

const hasStyle = () => {
  const fnStroke = (d, i) => '#fff'
  const fnStrokeDasharray = (d, i) => 0
  const fnStrokeWidth = (d, i) => 0
  const fnFill = (d, i) => d3.interpolateViridis(Math.random())
  const fnFillOpacity = (d, i) => 1
  const fnOpacity = (d, i) => 1
  const self = {
    fnStyle: (selection) =>
      selection.attr('stroke', fnStroke)
        .attr('stroke', fnStrokeDasharray)
        .attr('stroke-width', fnStrokeWidth)
        .attr('stroke-dasharray', fnStrokeDasharray)
        .attr('fill', fnFill)
        .attr('fill-opacity', fnFillOpacity)
        .attr('opacity', fnOpacity)
  }

  return self
}

const component = ({ registry = hasRegistry } = {}) => {
  // -> GETTERS
  let group
  let join // ...

  const fn_path2D = (d, i) => {}

  /* const fn_path = (d, i) => ''
  const fn_x = (d, i) => 0
  const fn_y = (d, i) => 0

  const fn_enter = enter => {}
  const fn_update = update => {}
  const fn_exit = exit => {}

  const phi = 0.2 */

  const draw = (chart) => {
    console.log('component component')
    // NOT CANVAS
    fn_path2D.context && fn_path2D.context(null)

    // appending the group
    if (!group) {
      group = chart
        .group()
        .append('g')
        .classed('component', true)
    }
  }

  const self = {
    ...registry(),
    ...hasStyle(),
    group () {
      return group || d3.select(null)
    },
    join () {
      return join || d3.select(null)
    }
  }

  console.log('Subscribing drawx to component')
  self.subscribe('drawx', draw)
  self.log()
  console.log('Subscribed!')

  return self
}
/*
  // *** THIS COULD BE AS A COMMON FUNCTION... dunno..
  multiTransition (selection, transition) {
    const self = this
    if (!selection.empty()) {
      return selection
        .transition(transition)
        .duration(transition.duration() * (1 - self._phi))
        .delay((_, i, nodes) => {
          return transition.delay() + (nodes.length > 1 ? i / (nodes.length - 1) * transition.duration() * self._phi : 0)
        })
    }
    return selection.transition(transition)
  }
  */

/*
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

      const path2D = new Path2D(s.attr('d'))

      context.save()

      context.translate(x, y)

      context.beginPath()

      context.globalAlpha = s.attr('opacity')

      if (lineWidth) {
        context.lineWidth = lineWidth
        context.strokeStyle = s.attr('stroke')
        context.stroke(path2D)
      }

      if (fillOpacity) {
        context.fillStyle = s.attr('fill')
        context.fill(path2D)
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
      const path2D = svgPath ? new Path2D(svgPath) : null

      if (lineWidth) {
        context.lineWidth = lineWidth
        context.strokeStyle = self._fn_stroke(d, i)
        path2D ? context.stroke(path2D) : context.stroke()
      }

      if (fillOpacity) {
        context.fillStyle = self._fn_fill(d, i)
        path2D ? context.fill(path2D) : context.fill()
      }

      context.restore()
    }

    if (self._group) { // if there is some svg to render
      self._join.each(fn_renderNodes)
    } else { // otherwise render directly from data
      self._componentData.forEach(fn_renderData)
    }
  }
  */

export default component
