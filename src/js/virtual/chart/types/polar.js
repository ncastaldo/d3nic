import { mean } from 'd3-array'

const hasPolar = (state = {}) => {
  let radiusExtent = [0, 1]
  let angleExtent = [0, Math.PI * 2]

  let center = [0, 0]
  let radius = 1
  let radiusRange = [0, 1]
  let angleRange = [...angleExtent]

  let firstDraw = true

  const self = {
    ...state,
    radiusExtent (value) {
      if (typeof value === 'undefined') return radiusExtent
      radiusExtent = value
    },
    angleExtent (value) {
      if (typeof value === 'undefined') return angleExtent
      angleExtent = value
    },
    center () {
      return center
    },
    radius () {
      return radius
    },
    radiusRange () {
      return radiusRange
    },
    angleRange () {
      return angleRange
    }
  }

  const update = () => {
    const extent = self.extent()
    center = [
      mean(extent, e => e[0]),
      mean(extent, e => e[1])
    ]
    radius = Math.min(
      center[0] - extent[0][0],
      center[1] - extent[0][1]
    )
    radiusRange = radiusExtent.map(re => re * radius)
    angleRange = [...angleExtent]
  }

  update() // auto trigger to update results

  const draw = () => {
    const translate = `translate(${center[0]}, ${center[1]})`

    if (firstDraw) {
      self.group()
        .attr('transform', translate)
    } else {
      self.group()
        .transition(self.transition())
        .attr('transform', translate)
    }

    firstDraw = false
  }

  self.subscribe('graphics', update)
  self.subscribe('draw', draw)

  return self
}

export { hasPolar }
