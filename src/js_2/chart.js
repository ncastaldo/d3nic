import * as d3 from '@/js/d3-modules.js'

const handler = {
  get: (object, property, receiver) => {
    return (value) => {
      if (property in object && typeof object[property] === 'function') {
        console.log(`calling ${property} with value ${value}`)
        if (value) {
          object[property](value, object)
          return new Proxy(object, handler)
        } else {
          console.log(receiver)
          return object[property](value, object)
        }
      }
      console.log(`no property ${property} here`)
      return undefined
    }
  }
}

const hasSelector = (state = {}) => {
  let selector = 'svg'
  const self = {
    ...state,
    selector: (value) => {
      if (typeof value === 'undefined') return selector
      selector = value
    }
  }
  return new Proxy(self, handler)
}

const hasSize = (state = {}) => {
  let width = 400
  let height = 300
  const self = {
    ...state,
    width: (value) => {
      if (typeof value === 'undefined') return width
      width = value
    },
    height: (value) => {
      if (typeof value === 'undefined') return height
      height = value
    }
  }
  return new Proxy(self, handler)
}

const hasData = (state = {}) => {
  let data = []
  const self = {
    ...state,
    data: (value) => {
      if (typeof value === 'undefined') return data
      data = value
    }
  }
  return new Proxy(self, handler)
}

const hasComponents = (state = {}) => {
  let components = []
  const self = {
    ...state,
    components: (value) => {
      if (typeof value === 'undefined') return components
      components = value
    }
  }
  return new Proxy(self, handler)
}

const chart = (state = {}) => {
  const self = {
    ...state,
    ...hasSelector(state),
    ...hasSize(state),
    ...hasData(state),
    ...hasComponents(state),
    draw: () => {
      // returning the selection will allow function decoration
      return d3.select(self.selector())
        .attr('width', self.width())
        .attr('height', self.height())
        .classed('chart', true)
    }
  }
  return new Proxy(self, handler)
}

const hasX = (state = {}) => {
  let xScale = 'scaleLinear'
  const self = {
    ...state,
    xScale: (value) => {
      if (typeof value === 'undefined') return xScale
      xScale = value
    }
  }
  return new Proxy(self, handler)
}

const hasY = (state = {}) => {
  let yScale = 'scaleLinear'
  const self = {
    ...state,
    yScale: (value) => {
      if (typeof value === 'undefined') return yScale
      yScale = value
    }
  }
  return new Proxy(self, handler)
}

const xyChart = (state = {}) => {
  const self = {
    ...state,
    ...hasX(state),
    ...hasY(state),
    ...chart(state)
  }

  const _draw = self.draw()

  self.draw = () => {
    return _draw.classed('xy-chart', true)
  }
  return new Proxy(self, handler)
}

const component = (state) => {
  let fn_value = d => d

  const self = {
    ...state,
    fn_value: (value) => {
      if (typeof value === 'undefined') return fn_value
      fn_value = value
      return new Proxy(self, handler)
    }
  }
  return new Proxy(self, handler)
}

export {
  chart,
  xyChart,
  component
}
