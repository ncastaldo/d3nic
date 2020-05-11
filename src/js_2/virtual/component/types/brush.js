import pipe from 'lodash/fp/flow'
import { brushX, brushY } from 'd3-brush'
import { event, mouse } from 'd3-selection'

const computeBrush = (on) => {
  return on === 'x' ? brushX() : brushY()
}

const hasBrushFactory = (on = 'x') => (state = {}) => {
  let chartExtent = null

  let onBrush = () => {}
  let onEnd = () => {}

  const self = {
    ...state,
    onBrush: (value) => {
      if (typeof value === 'undefined') return onBrush
      onBrush = value
    },
    onEnd: (value) => {
      if (typeof value === 'undefined') return onEnd
      onEnd = value
    },
    fnBrush: () => {
      return computeBrush(on)
        .extent(chartExtent)
        .on('brush.d3nic', onBrush)
        .on('end.d3nic', onEnd)
    }
  }

  const update = (chart) => {
    chartExtent = chart.extent()
  }

  // + init
  self.subscribe('data', update)
  self.subscribe('components', update)
  self.subscribe('size', update)
  self.subscribe('padding', update)

  return self
}

const hasBandBrushFactory = (on = 'x') => (state = {}) => {
  let chartData = null
  let bandDomain = null

  let bandBrushDomain = null
  let bandBrushRange = null

  const self = {
    ...state,
    ...pipe(
      hasBrushFactory(on)
    )(state),
    bandBrushDomain: () => {
      return bandBrushDomain
    },
    bandBrushRange: () => {
      return bandBrushRange
    }
  }

  const onBrush = () => {
    if (!event.selection || !event.sourceEvent || event.sourceEvent.type !== 'mousemove') { return }
    const indexes = chartData.map(self.fnBandCenterOut())
      .map((c, i) => c >= event.selection[0] && c <= event.selection[1] ? i : -1)
      .filter(i => i >= 0)
    bandBrushDomain = indexes.length
      ? indexes.map(i => bandDomain[i])
      : null
    bandBrushRange = indexes.length
      ? [indexes[0], indexes[indexes.length - 1]]
        .map(i => ({ d: chartData[i], i }))
        .map(({ d, i }, j) => (j === 0 ? self.fnBandLeftOut() : self.fnBandRightOut())(d, i))
      : null
    // snapping
    event.target.move(self.group(), bandBrushRange)
  }

  const onEnd = () => {
    if (!event.sourceEvent || event.sourceEvent.type !== 'mouseup') { return }
    console.log(event.sourceEvent)
  }

  self.onBrush(onBrush)
  self.onEnd(onEnd)

  const update = (chart) => {
    chartData = chart.data()
    bandDomain = chart.fnBandScale().domain()
  }

  // + init
  self.subscribe('data', update)
  self.subscribe('components', update)
  self.subscribe('size', update)
  self.subscribe('padding', update)

  return self
}

const hasContBrushFactory = (on = 'x') => (state = {}) => {
  const self = {
    ...state,
    ...pipe(
      hasBrushFactory(on)
    )(state)
  }

  /* brushSelection: () => {
    return brushProportion ? brushProportion.map(p => (chartExtent[1][0] - chartExtent[0][0]) * p)
      : null
  }, */

  const onBrush = () => {
    if (!event.selection || !event.sourceEvent) { return }
    console.log(event.target)
  }

  /* const onEnd = () => {
    if (!event.selection || !event.sourceEvent) { return }
    brushProportion = event.selection
      .map(e => e / (chartExtent[1][0] - chartExtent[0][0]))
  } */

  self.onBrush(onBrush)
  // self.onEnd(onEnd)

  const update = (chart) => {
    // translateAxis = computeTranslate(chart, on, position)
  }

  // + init
  self.subscribe('data', update)
  self.subscribe('components', update)
  self.subscribe('size', update)
  self.subscribe('padding', update)

  return self
}

export { hasBandBrushFactory, hasContBrushFactory }
