import { mean } from 'd3-array'

const hasPolar = (state = {}) => {
  let radiusExtent = [0, 1]
  let angleExtent = [0, Math.PI * 2]

  let center = [0, 0]
  let radius = 1
  let radiusRange = [0, 1]
  const angleRange = angleExtent // fixed

  let firstDraw = true

  const self = {
    ...state,
    radiusExtent: (value) => {
      if (typeof value === 'undefined') return radiusExtent
      radiusExtent = value
    },
    angleExtent: (value) => {
      if (typeof value === 'undefined') return angleExtent
      angleExtent = value
    },
    center: () => {
      return center
    },
    radius: () => {
      return radius
    },
    radiusRange: () => {
      return radiusRange
    },
    angleRange: () => {
      return angleRange
    }
  }

  const update = (chart) => {
    const extent = chart.extent()
    center = [
      mean(extent, e => e[0]),
      mean(extent, e => e[1])
    ]
    radius = Math.min(
      center[0] - extent[0][0],
      center[1] - extent[0][1]
    )
    radiusRange = radiusExtent.map(re => re * radius)
  }

  self.subscribe('size', update)
  self.subscribe('padding', update)

  const draw = (chart) => {
    const translate = `translate(${center[0]}, ${center[1]})`

    if (firstDraw) {
      chart.group()
        .attr('transform', translate)
    } else {
      chart.group()
        .transition(chart.transition())
        .attr('transform', translate)
    }

    firstDraw = false
  }

  self.subscribe('draw', draw)

  return self
}

export { hasPolar }
