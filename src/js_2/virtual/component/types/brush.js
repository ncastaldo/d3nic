import { brushX, brushY } from 'd3-brush'
import { event } from 'd3-selection'

const computeBrush = (on) => {
  return on === 'x' ? brushX() : brushY()
}

const hasBrushFactory = (on = 'x') => (state = {}) => {
  let chartExtent = null
  let brushProportion = null

  const self = {
    ...state,
    brushSelection: () => {
      return brushProportion ? brushProportion.map(p => (chartExtent[1][1] - chartExtent[0][1]) * p)
        : null
    },
    fnBrush: () => {
      return computeBrush(on)
        .extent(chartExtent)
        .on('brush.d3nic', onBrush)
    }
  }

  const onBrush = () => {
    if (!event.selection) { return }
    brushProportion = event.selection
      .map(e => e / (chartExtent[1][1] - chartExtent[0][1]))
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

export { hasBrushFactory }
