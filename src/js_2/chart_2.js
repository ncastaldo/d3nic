import * as d3 from '@/js/d3-modules.js'

const chart = (state) => {
  let selector = 'svg'

  let container
  let group
  let context
  let fn_interval
  let transition

  let firstDraw = true

  let isCanvas

  let size = {
    width: 400,
    height: 300
  }

  let padding = {
    top: 25,
    right: 25,
    bottom: 25,
    left: 25
  }

  let transitionObject = {
    name: '',
    duration: 0,
    delay: 0
  }

  let fn_key = (d, i) => i
  let valueDomain = [NaN, NaN]
  let data = []

  let components = []

  const updateComponents = () => {
    components.forEach(c => {
      !c.chart() && c.chart(self)// not defined yet (?)
      c.update()
    })
  }

  const fitContainer = () => {
    // *** expects container to exist
    container
      .transition(transition)
      .attr(!isCanvas ? 'width' : 'canvas-width', size.width)
      .attr(!isCanvas ? 'height' : 'canvas-height', size.height)
  }

  // *** RECONSIDER the valueDomain
  const getValueDomain = () => {
    components
      .map(c => c.fn_valueDomain(data))
      .reduce((acc, cur) => {
        return d3.extent(acc.concat(cur))
      }, valueDomain)
  }

  const clearCanvas = () => {
    context.clearRect(0, 0, size.width, size.height)
  }

  const self = {
    ...state,
    selector: (value) => {
      selector = value
      return self
    },
    size: (value) => {
      if (typeof value === 'undefined') return size
      // CONTROL ON SIZE, freeze it maybe
      size = value
      // *** updateChart()
      updateComponents()
      return self
    },
    padding: (value) => {
      if (typeof value === 'undefined') return padding
      // CONTROL ON padding, freeze it maybe
      padding = value
      // *** updateChart()
      updateComponents()
      return self
    },
    fn_key: (value) => {
      if (typeof value === 'undefined') return fn_key
      fn_key = value
      return self
    },
    data: (value) => {
      if (typeof value === 'undefined') return data
      // CONTROL ON data, MUST BE ARRAY(?)
      data = value
      // *** updateChart()
      updateComponents()
      return self
    },
    components: (value) => {
      if (typeof value === 'undefined') return components
      // CONTROL ON components, MUST BE ARRAY(?)
      components = value
      // *** updateChart()
      updateComponents()
      return self
    },
    transitionObject: (value) => {
      if (typeof value === 'undefined') return transitionObject
      transitionObject = value
      return self
    },
    valueDomain: (value) => {
      if (typeof value === 'undefined') return valueDomain
      valueDomain = value
      return valueDomain
    },
    // getters
    extent: () => {
      return [
        [padding.left, padding.top],
        [size.width - padding.right, size.height - padding.bottom]
      ]
    },
    group: () => {
      return group
    },
    transition: () => {
      return transition
    },
    context: () => {
      return context
    },
    // draw
    draw: ({ name = '', duration = 0, delay = 0 } = {}) => {
      // *** check this
      transitionObject = { name, duration, delay }

      // first draw?
      if (firstDraw) {
        container = d3.select(selector)

        isCanvas = container.node() instanceof HTMLCanvasElement

        if (isCanvas) {
          context = container.node().getContext('2d')
        }

        // first draw, set size immediately
        container
          .attr('width', size.width)
          .attr('height', size.height)

        group = container
          .append('g')
          .classed('chart', true)
      }

      transition = container
        .transition(transitionObject.name)
        .duration(transitionObject.duration)
        .delay(transitionObject.delay)

      fitContainer()

      // draw the svg nodes if it is NOT a canvas OR the duration is NOT zero
      if (!context || transitionObject.duration) {
        // adjusting the size ONLY if no canvas
        components.forEach(component => component.draw(transition))
      }

      // only in case of canvas
      if (context) {
        if (fn_interval) fn_interval.stop()

        // if elapsed is '-1' then stop
        const fn_drawComponentsCanvas = (elapsed) => {
          clearCanvas()

          if (!firstDraw) {
            container.attr('width', container.attr('canvas-width'))
            container.attr('height', container.attr('canvas-height'))
          }

          components.forEach(c => c.drawCanvas())

          if (elapsed >= transitionObject.duration) fn_interval.stop()
        }

        d3.timeout(() => {
          if (transitionObject.duration) {
            fn_interval = d3.interval(fn_drawComponentsCanvas, 34) // draw every 34 MS
          } else {
            // to render the canvas in the next tick,
            // in order to have correct canvas-width and canvas-height
            fn_interval = d3.timeout(fn_drawComponentsCanvas, 0)
          }
        }, transitionObject.delay)
      }

      firstDraw = false

      return self

      // handling old components
      // self.components.forEach(component => component.group.classed("js__keep-chart-component", true));
      // self.group.selectAll(".component:not(.js__keep-chart-component)").remove(); // may be a problem with nested charts
      // self.components.forEach(component => component.group.classed("js__keep-chart-component", false));
    }
  }

  return self
}

export { chart }
