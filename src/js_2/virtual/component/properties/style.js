import * as d3 from '@/js/d3-modules.js'

const hasStyle = (state = {}) => {
  let fnStroke = (d, i) => '#000'
  let fnStrokeDasharray = (d, i) => 0
  let fnStrokeWidth = (d, i) => 0
  let fnFill = (d, i) => d3.interpolateYlGnBu(Math.random())
  let fnFillOpacity = (d, i) => 1
  let fnOpacity = (d, i) => 1

  const fnStyle = s =>
    s.attr('stroke', fnStroke)
      .attr('stroke-width', fnStrokeWidth)
      .attr('stroke-dasharray', fnStrokeDasharray)
      .attr('fill', fnFill)
      .attr('fill-opacity', fnFillOpacity)
      .attr('opacity', fnOpacity)

  const self = {
    ...state,
    fnStroke: (value) => {
      if (typeof value === 'undefined') return fnStroke
      fnStroke = value
    },
    fnStrokeDasharray: (value) => {
      if (typeof value === 'undefined') return fnStrokeDasharray
      fnStrokeDasharray = value
    },
    fnStrokeWidth: (value) => {
      if (typeof value === 'undefined') return fnStrokeWidth
      fnStrokeWidth = value
    },
    fnFill: (value) => {
      if (typeof value === 'undefined') return fnFill
      fnFill = value
    },
    fnFillOpacity: (value) => {
      if (typeof value === 'undefined') return fnFillOpacity
      fnFillOpacity = value
    },
    fnOpacity: (value) => {
      if (typeof value === 'undefined') return fnOpacity
      fnOpacity = value
    },
    fnStyle: () => {
      return fnStyle
    }
  }

  return self
}

export { hasStyle }
