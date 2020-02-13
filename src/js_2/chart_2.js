import * as d3 from '@/js/d3-modules.js'

const chart = (state) => {
  let selector = 'svg'

  let container
  let group
  let context

  let fn_interval
  let transition

  let firstDraw = true

  let isCanvas = false

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

  let fnKey = (d, i) => i
  let data = []
  let components = []

  const registry = {}

  const fitContainer = () => {
    // *** expects container to exist
    container
      .transition(transition)
      .attr(!isCanvas ? 'width' : 'canvas-width', size.width)
      .attr(!isCanvas ? 'height' : 'canvas-height', size.height)
  }

  const clearCanvas = () => {
    context.clearRect(0, 0, size.width, size.height)
  }

  return {
    selector: (value) => {
      selector = value
    },
    size: (value) => {
      if (typeof value === 'undefined') return size
      // CONTROL ON SIZE, freeze it maybe
      size = value
      // updateComponents()
    },
    padding: (value) => {
      if (typeof value === 'undefined') return padding
      // CONTROL ON padding, freeze it maybe
      padding = value
      // updateComponents()
    },
    fnKey: (value) => {
      if (typeof value === 'undefined') return fnKey
      fnKey = value
    },
    data: (value) => {
      if (typeof value === 'undefined') return data
      // CONTROL ON data, MUST BE ARRAY(?)
      data = value
      // updateComponents()
    },
    components: (value) => {
      if (typeof value === 'undefined') return components
      // CONTROL ON components, MUST BE ARRAY(?)
      components = value
      components.forEach(c => c.chart(state))
    },
    transitionObject: (value) => {
      if (typeof value === 'undefined') return transitionObject
      transitionObject = value
    },
    // getters
    /* extent: () => {
      return [
        [padding.left, padding.top],
        [size.width - padding.right, size.height - padding.bottom]
      ]
    }, */
    group: () => {
      return group
    },
    transition: () => {
      return transition
    },
    context: () => {
      return context
    },
    // registry
    subscribe: (fn, ...topics) => {
      topics.forEach(topic => {
        if (!(topic in registry)) { registry[topic] = [] }
        registry[topic].push(fn)
      })
    },
    publish: (topic, data) => {
      (registry[topic] || []).forEach(fn => fn(data))
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

        // components.forEach(component => component.draw(transition))
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

          // components.forEach(c => c.drawCanvas())

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

      // handling old components
      // state.components.forEach(component => component.group.classed("js__keep-chart-component", true));
      // state.group.selectAll(".component:not(.js__keep-chart-component)").remove(); // may be a problem with nested charts
      // state.components.forEach(component => component.group.classed("js__keep-chart-component", false));
    }
  }
}

export { chart }
