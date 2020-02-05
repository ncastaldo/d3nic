import * as d3 from '@/js/d3-modules.js'

const chart = (state) => {
  const selector = 'selector' in state ? state.selector : 'svg'

  let size = { width: 200, height: 300 }
  let components = []
  let data = []

  let container

  const fn_update = () => components.update()

  const self = {
    ...state,
    size: (value) => {
      if (typeof value === 'undefined') return size
      size = value
      fn_update()
      return self
    },
    components: (value) => {
      if (typeof value === 'undefined') return components
      components = value
      fn_update()
      return self
    },
    addComponent: (value) => {
      components.push(value)
      fn_update()
      return self
    },
    addComponents: (value) => {
      components.concat(value)
      fn_update()
      return self
    },
    data: (value) => {
      if (typeof value === 'undefined') return data
      data = value
      fn_update()
      return self
    },
    draw: () => {
      container = container ||
        d3.select(selector)
          .attr('width', size.width)
          .attr('height', size.height)
      return self
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

const component = (state) => {
  let fn_value = d => d

  const self = {
    ...state,
    fn_value: (value) => {
      if (typeof value === 'undefined') return fn_value
      fn_value = value
      return self
    }
  }
  return self
}

export {
  chart,
  xyChart,
  component
}
