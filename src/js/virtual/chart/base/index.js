import { select } from 'd3-selection'
import { timeout, interval } from 'd3-timer'
import pipe from 'lodash/fp/flow'

import { hasRegistry } from '../../common/registry'

const chart = (state = {}) => {
  let selector = 'svg'

  let container
  let group
  let context

  let fnInterval
  let transition

  let firstDraw = true

  let isCanvas = false

  let size = {
    width: 400,
    height: 300
  }

  let padding = {
    top: 40,
    right: 40,
    bottom: 40,
    left: 40
  }

  let transitionObject = {
    name: '',
    duration: 0,
    delay: 0
  }

  let fnKey = (d, i) => i
  let data = []
  let components = []

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

  const spreadPublish = (...args) => {
    const [chart, ...topics] = args.reverse()
    chart.publish(...topics, chart)
    components.forEach(c => c.publish(...topics, chart))
  }

  const self = {
    ...state,
    ...pipe(
      hasRegistry
    )(state),
    selector (value) {
      selector = value
    },
    size (value) {
      if (typeof value === 'undefined') return { ...size }
      size = { ...size, ...value }
      spreadPublish('graphics', this)
    },
    padding (value) {
      if (typeof value === 'undefined') return { ...padding }
      padding = { ...padding, ...value }
      spreadPublish('graphics', this)
    },
    data (value) {
      if (typeof value === 'undefined') return [...data]
      data = value
      spreadPublish('data', this)
    },
    components (value) {
      if (typeof value === 'undefined') return [...components]
      components = value
      spreadPublish('components', this)
    },
    transitionObject (value) {
      if (typeof value === 'undefined') return { ...transitionObject }
      transitionObject = { ...transitionObject, ...value }
    },
    fnKey (value) {
      if (typeof value === 'undefined') return fnKey
      fnKey = value
    },
    // getters
    extent () {
      return [
        [padding.left, padding.top],
        [size.width - padding.right, size.height - padding.bottom]
      ]
    },
    group () {
      return group
    },
    transition () {
      return transition
    },
    context () {
      return context
    },
    // draw ---> it accepts a transitionObject
    draw ({
      name = transitionObject.name,
      duration = transitionObject.duration,
      delay = transitionObject.delay
    } = {}) {
      // *** check this
      transitionObject = { name, duration, delay }

      // first draw?
      if (firstDraw) {
        container = select(selector)

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
        if (fnInterval) fnInterval.stop()

        // if elapsed is '-1' then stop
        const fn_drawComponentsCanvas = (elapsed) => {
          clearCanvas()

          if (!firstDraw) {
            container.attr('width', container.attr('canvas-width'))
            container.attr('height', container.attr('canvas-height'))
          }

          // components.forEach(c => c.drawCanvas())

          if (elapsed >= transitionObject.duration) fnInterval.stop()
        }

        timeout(() => {
          if (transitionObject.duration) {
            fnInterval = interval(fn_drawComponentsCanvas, 34) // draw every 34 MS
          } else {
            // to render the canvas in the next tick,
            // in order to have correct canvas-width and canvas-height
            fnInterval = timeout(fn_drawComponentsCanvas, 0)
          }
        }, transitionObject.delay)
      }

      firstDraw = false

      // handling old components
      // state.components.forEach(component => component.group.classed("js__keep-chart-component", true));
      // state.group.selectAll(".component:not(.js__keep-chart-component)").remove(); // may be a problem with nested charts
      // state.components.forEach(component => component.group.classed("js__keep-chart-component", false));

      spreadPublish('draw', this)
    }
  }

  return self
}

export default chart
