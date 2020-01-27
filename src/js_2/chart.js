import * as d3 from '@/js/d3-modules.js'

const chart = (state) => {
  let selector = 'svg'
  let size = { width: 200, height: 300 }
  let components = []
  let data = []

  let container

  const self = {
    ...state,
    selector: (value) => {
      if (typeof value === 'undefined') return selector
      selector = value
      return self
    },
    size: (value) => {
      if (typeof value === 'undefined') return size
      size = value
      return self
    },
    components: (value) => {
      if (typeof value === 'undefined') return components
      components = value
      return self
    },
    data: (value) => {
      if (typeof value === 'undefined') return data
      data = value
      return self
    },
    draw: () => {
      container = container ||
        d3.select(selector)
          .attr('width', size.width)
          .attr('height', size.height)
      components.forEach(c => c.draw())
      return { ...self }
    }
  }

  return self
}

const x = (state) => {
  let xScale = 'scaleLinear'
  const self = {
    ...state,
    xScale: (value) => {
      if (typeof value === 'undefined') return xScale
      xScale = value
      return self
    }
  }
  return self
}

const y = (state) => {
  let yScale = 'scaleLinear'
  const self = {
    ...state,
    yScale: (value) => {
      if (typeof value === 'undefined') return yScale
      yScale = value
      return self
    }
  }
  return self
}

const xyChart = (state) => {
  const self = {
    ...state,
    ...x(state),
    ...y(state),

    ...chart(state)
  }
  return self
}

export {
  chart,
  xyChart
}
