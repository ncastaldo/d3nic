import * as d3 from '@/js/d3-modules.js'

const hasStyle = (state = {}) => {
  const fnStroke = (d, i) => '#fff'
  const fnStrokeDasharray = (d, i) => 0
  const fnStrokeWidth = (d, i) => 0
  const fnFill = (d, i) => d3.interpolateViridis(Math.random())
  const fnFillOpacity = (d, i) => 1
  const fnOpacity = (d, i) => 1

  const fnStyle = s =>
    s.attr('stroke', fnStroke)
      .attr('stroke', fnStrokeDasharray)
      .attr('stroke-width', fnStrokeWidth)
      .attr('stroke-dasharray', fnStrokeDasharray)
      .attr('fill', fnFill)
      .attr('fill-opacity', fnFillOpacity)
      .attr('opacity', fnOpacity)

  const self = {
    ...state,
    fnStyle: () => {
      return fnStyle
    }
  }

  return self
}

export { hasStyle }
