import * as d3 from '@/js/d3-modules.js'

export default class Chart {
  constructor (selector, params = {}) {
    const self = this

    self._selector = selector

    self.initChart(self, params)
    self.initComponents(self)
  }

  initChart (self, params) {
    self._container = null
    self._context = null
    self._fn_interval = null

    self._size = {
      width: 400,
      height: 300
    }

    self._padding = {
      top: 10,
      right: 10,
      bottom: 10,
      left: 10
    }

    self._transition = {
      name: null,
      duration: 0,
      delay: 0
    }

    Object.assign(self._size, params.size || {})
    Object.assign(self._padding, params.padding || {})
    Object.assign(self._transition, params.transition || {})

    self._fn_key = params.fn_key || ((d, i) => i)
    self._valueDomain = params.valueDomain || [NaN, NaN]
    self._data = params.data || []
    self._components = params.components || []
  }

  initComponents (self) {
    self._components.filter(c => !c.chart).forEach(c => { c.chart = self })
  }

  // fits the size of the svg or canvas
  fitContainer (self) {
    self._container
      .attr('width', self._size.width)
      .attr('height', self._size.height)
  }

  getValueDomain (self) {
    return self._components
      .map(c => c.fn_valueDomain(self._data))
      .reduce((acc, cur) => {
        return d3.extent(acc.concat(cur))
      }, self._valueDomain)
  }

  clearCanvas (self) {
    self._context.fillStyle = '#fff'
    self._context.fillRect(0, 0, self._size.width, self._size.height)
  }

  get size () {
    const self = this
    return self._size
  }

  set size (size) {
    const self = this
    Object.assign(self._size, size)
  }

  get padding () {
    const self = this
    return self._padding
  }

  set transition (transition) {
    const self = this
    Object.assign(self._transition, transition)
  }

  get fn_key () {
    const self = this
    return self._fn_key
  }

  get data () {
    const self = this
    return self._data
  }

  set data (data) {
    const self = this
    self._data = data
  }

  get components () {
    const self = this
    return self._components
  }

  set components (components) {
    const self = this
    self._components = components
    self._components.filter(c => !c.chart).forEach(c => { c.chart = self })
  }

  get group () {
    const self = this
    return self._group
  }

  get transition () {
    const self = this
    return self._transition
  }

  get context () {
    const self = this
    return self._context
  }

  draw (t) {
    const self = this

    Object.assign(self._transition, t || {})

    // first draw?
    if (!self._group) {
      self._container = d3.select(self._selector)

      if (self._container.node() instanceof HTMLCanvasElement) {
        self._context = self._container.node().getContext('2d')
      }

      self._group = self._container
        .append('g')
        .classed('chart', true)
    }

    // adjusting the size
    self.fitContainer(self)

    // creating the transition
    // const tName = tObject.hasOwnProperty('name') ? tObject.name : null
    // const tDuration = tObject.hasOwnProperty('duration') ? tObject.duration : 0
    // const tDelay = tObject.hasOwnProperty('delay') ? tObject.delay : 0

    const transition = d3
      .transition(self._transition.name)
      .duration(self._transition.duration)
      .delay(self._transition.delay)

    // draw the nodes if it is not a canvas or the duration is zero
    if (!self._context || self._transition.duration) {
      self._components.forEach(component => component.draw(transition))
    }

    if (self._context) {
      if (self._fn_interval) self._fn_interval.stop()

      // self.clearCanvas(self)

      const fn_drawComponentsCanvas = (elapsed) => {
        console.log('rendering canvas: ' + (elapsed || 'immediate'))

        self.clearCanvas(self)
        self._components.forEach(c => c.drawCanvas())

        if (elapsed > self._transition.duration) self._fn_interval.stop()
      }

      if (self._transition.duration) {
        self._fn_interval = d3.interval(fn_drawComponentsCanvas, 34)
      } else {
        transition.on('end.canvas interrupt.canvas', fn_drawComponentsCanvas)
      }
    }

    // handling old components
    // self.components.forEach(component => component.group.classed("js__keep-chart-component", true));
    // self.group.selectAll(".component:not(.js__keep-chart-component)").remove(); // may be a problem with nested charts
    // self.components.forEach(component => component.group.classed("js__keep-chart-component", false));
  }
}
