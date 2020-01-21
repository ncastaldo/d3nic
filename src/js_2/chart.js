import * as d3 from '@/js/d3-modules.js'

const chart = ({
  selector = 'svg',
  id = '',
  width = 200,
  height = 300,
  components = [],
  data = []
}) => {
  const state = {
    selector,
    id,
    width,
    height,
    components,
    data
  }

  state.draw = () => {
    state.container = state.container ||
      d3.select(state.selector)
        .attr('id', state.id)
        .attr('width', state.width)
        .attr('height', state.height)
    state.components.forEach(c => c.draw())
  }

  const handler = {
    set (target, prop, val, receiver) {
      const reflectSet = Reflect.set(target, prop, val, receiver) // (2)
      console.log(`SET ${prop}=${val}`)
      return reflectSet
    }
  }

  return new Proxy(state, handler)
}

const xyChart = ({
  xScale = 'scaleLinear',
  yScale = 'scaleLinear',
  ...args
}) => {
  const state = {
    xScale,
    yScale,
    ...args
  }

  return chart(state)
}

export {
  chart,
  xyChart
}
