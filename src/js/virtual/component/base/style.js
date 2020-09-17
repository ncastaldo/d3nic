import { interpolateViridis } from 'd3-scale-chromatic'

const hasStyle = (state = {}) => {
  let fnStroke = null
  let fnStrokeDasharray = null
  let fnStrokeWidth = null
  let fnFill = () => interpolateViridis(Math.random())
  let fnFillOpacity = null
  let fnOpacity = 1

  // function to update values
  const getAttrs = () => [
    ['stroke', fnStroke],
    ['stroke-dasharray', fnStrokeDasharray],
    ['stroke-width', fnStrokeWidth],
    ['fill', fnFill],
    ['fill-opacity', fnFillOpacity],
    ['opacity', fnOpacity]
  ]

  const fnStyle = selection => getAttrs()
    .filter(([_, fn]) => fn !== null)
    .reduce((s, [attr, fn]) => s.attr(attr, fn), selection)

  const self = {
    ...state,
    fnStroke (value) {
      if (typeof value === 'undefined') return fnStroke
      fnStroke = value
    },
    fnStrokeDasharray (value) {
      if (typeof value === 'undefined') return fnStrokeDasharray
      fnStrokeDasharray = value
    },
    fnStrokeWidth (value) {
      if (typeof value === 'undefined') return fnStrokeWidth
      fnStrokeWidth = value
    },
    fnFill (value) {
      if (typeof value === 'undefined') return fnFill
      fnFill = value
    },
    fnFillOpacity (value) {
      if (typeof value === 'undefined') return fnFillOpacity
      fnFillOpacity = value
    },
    fnOpacity (value) {
      if (typeof value === 'undefined') return fnOpacity
      fnOpacity = value
    },
    fnStyle () {
      return fnStyle
    }
  }

  return self
}

export { hasStyle }
