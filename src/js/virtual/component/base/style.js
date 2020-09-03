import { interpolateViridis } from 'd3-scale-chromatic'

const hasStyle = (state = {}) => {
  let stroke = '#000'
  let strokeDasharray = 0
  let strokeWidth = 0
  let fill = () => interpolateViridis(Math.random())
  let fillOpacity = 1
  let opacity = 1

  const fnStyle = s =>
    s.attr('stroke', stroke)
      .attr('stroke-width', strokeWidth)
      .attr('stroke-dasharray', strokeDasharray)
      .attr('fill', fill)
      .attr('fill-opacity', fillOpacity)
      .attr('opacity', opacity)

  const self = {
    ...state,
    stroke (value) {
      if (typeof value === 'undefined') return stroke
      stroke = value
    },
    strokeDasharray (value) {
      if (typeof value === 'undefined') return strokeDasharray
      strokeDasharray = value
    },
    strokeWidth (value) {
      if (typeof value === 'undefined') return strokeWidth
      strokeWidth = value
    },
    fill (value) {
      if (typeof value === 'undefined') return fill
      fill = value
    },
    fillOpacity (value) {
      if (typeof value === 'undefined') return fillOpacity
      fillOpacity = value
    },
    opacity (value) {
      if (typeof value === 'undefined') return opacity
      opacity = value
    },
    fnStyle () {
      return fnStyle
    }
  }

  return self
}

export { hasStyle }
