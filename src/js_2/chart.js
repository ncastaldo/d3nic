import * as d3 from '@/js/d3-modules.js'

const handler = {
  get: (object, property) => {
    return (value) => {
      if (property in object && typeof object[property] === 'function') {
        if (value) {
          object[property](value)
          return new Proxy(object, handler)
        } else {
          return object[property]()
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
  return self
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
  return self
}

const isDrawable = (state = {}) => {
  const self = {
    ...state,
    ...hasSelector(state),
    ...hasSize(state),
    draw: () => {
      return d3.select(self.selector())
        .attr('width', self.width())
        .attr('height', self.height())
    }
  }
  return self
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
  return self
}

const hasComponents = (state = {}) => {
  let components = []
  const self = {
    ...state,
    components: (value) => {
      if (typeof value === 'undefined') return components
      components = value
      components.forEach(c => { c.chart(self) })
    }
  }
  return self
}

const chart = (state = {}) => {
  const self = {
    ...state,
    ...isDrawable(state),
    ...hasData(state),
    ...hasComponents(state)
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
  return self
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
  return self
}

const xyChart = (state = {}) => {
  const self = {
    ...state,
    ...isDrawable(state),
    ...hasData(state),
    ...hasComponents(state),
    ...hasX(state),
    ...hasY(state)
  }
  return new Proxy(self, handler)
}

const component = (state) => {
  let chart = null

  let fn_key = (d, i) => i
  let fn_value = d => d

  const self = {
    ...state,
    ...hasData(state),
    chart: (value) => {
      if (typeof value === 'undefined') return chart
      chart = value
    },
    fn_key: (value) => {
      if (typeof value === 'undefined') return fn_key
      fn_key = value
    },
    fn_value: (value) => {
      if (typeof value === 'undefined') return fn_value
      fn_value = value
    }
  }
  return new Proxy(self, handler)
}

export {
  chart,
  xyChart,
  component
}
