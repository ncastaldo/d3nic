import pipe from 'lodash/fp/flow'
import { brushX, brushY } from 'd3-brush'
import { event } from 'd3-selection'

const computeBrush = (on) => {
  return on === 'x' ? brushX() : brushY()
}

const hasBrushFactory = (on = 'x') => (state = {}) => {
  let chartExtent = null
  let brushProportion = null

  let onBrush = () => {}

  const self = {
    ...state,
    brushSelection: () => {
      return brushProportion ? brushProportion.map(p => (chartExtent[1][0] - chartExtent[0][0]) * p)
        : null
    },
    onBrush: (value) => {
      if (typeof value === 'undefined') return onBrush
      onBrush = value
    },
    fnBrush: () => {
      return computeBrush(on)
        .extent(chartExtent)
        .on('brush.d3nic', onBrush)
        .on('end.d3nic', onEnd)
    }
  }

  const onEnd = () => {
    if (!event.selection || !event.sourceEvent) { return }
    brushProportion = event.selection
      .map(e => e / (chartExtent[1][0] - chartExtent[0][0]))
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
  const self = {
    ...state,
    ...pipe(
      hasBrushFactory(on)
    )(state)
  }

  const onBrush = () => {
    if (!event.selection || !event.sourceEvent) { return }
    console.log(event.target)
  }

  self.onBrush(onBrush)

  return self
}

export { hasBandBrushFactory }
