import * as d3 from '@/js/d3-modules.js'

export default class Chart {
  constructor (selector, params = {}) {
    const self = this

    self._selector = selector

    self.initChart(self, params)
    self.initComponents(self)
  }

  initChart (self, params) {
    self._container = undefined
    self._context = undefined
    self._fn_interval = undefined
    self._transition = undefined

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

    self._transitionObject = {
      name: null,
      duration: 0,
      delay: 0
    }

    Object.assign(self._size, params.size || {})
    Object.assign(self._padding, params.padding || {})
    Object.assign(self._transitionObject, params.transitionObject || {})

    self._fn_key = params.fn_key || ((d, i) => i)
    self._valueDomain = params.valueDomain || [NaN, NaN]
    self._data = params.data || []

    self._components = params.components || []
  }

  initComponents (self) {
    self._components
      .filter(c => !c.chart)
      .forEach(c => {
        c.chart = self
        c.update()
      })
  }

  updateChart (self) {}

  updateComponents (self) {
    self._components.forEach(c => c.update())
  }

  // fits the size of the svg or canvas
  fitContainer (self) {
    const isCanvas = self._container.node() instanceof HTMLCanvasElement
    self._container
      .transition(self._transition)
      .attr(!isCanvas ? 'width' : 'canvas-width', self._size.width)
      .attr(!isCanvas ? 'height' : 'canvas-height', self._size.height)
  }

  getValueDomain (self) {
    return self._components
      .map(c => c.fn_valueDomain(self._data))
      .reduce((acc, cur) => {
        return d3.extent(acc.concat(cur))
      }, self._valueDomain)
  }

  clearCanvas (self) {
    self._context.clearRect(0, 0, self._size.width, self._size.height)
  }

  get size () {
    const self = this
    return self._size
  }

  set size (size) {
    const self = this
    Object.assign(self._size, size)
    self.updateChart(self)
    self.updateComponents(self)
  }

  get padding () {
    const self = this
    return self._padding
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
    self.updateChart(self)
    self.updateComponents(self)
  }

  get components () {
    const self = this
    return self._components
  }

  set components (components) {
    const self = this
    self._components = components

    self.initComponents(self)

    self.updateChart(self)
    self.updateComponents(self)
  }

  get group () {
    const self = this
    return self._group
  }

  get transitionObject () {
    const self = this
    return self._transitionObject
  }

  set transitionObject (transitionObject) {
    const self = this
    Object.assign(self._transitionObject, transitionObject)
  }

  get transition () {
    const self = this
    return self._transition
  }

  get context () {
    const self = this
    return self._context
  }

  draw (transitionObject = {}) {
    const self = this

    Object.assign(self._transitionObject, transitionObject)

    const firstDraw = !self._group

    // first draw?
    if (firstDraw) {
      self._container = d3.select(self._selector)

      if (self._container.node() instanceof HTMLCanvasElement) {
        self._context = self._container.node().getContext('2d')
      }

      // first draw, set size immediately
      self._container
        .attr('width', self._size.width)
        .attr('height', self._size.height)

      self._group = self._container
        .append('g')
        .classed('chart', true)
    }

    self._transition = self._container
      .transition(self._transitionObject.name)
      .duration(self._transitionObject.duration)
      .delay(self._transitionObject.delay)

    self.fitContainer(self)

    // draw the svg nodes if it is NOT a canvas OR the duration is NOT zero
    if (!self._context || self._transitionObject.duration) {
      // adjusting the size ONLY if no canvas
      self._components.forEach(component => component.draw(self._transition))
    }

    // only in case of canvas
    if (self._context) {
      if (self._fn_interval) self._fn_interval.stop()

      // if elapsed is '-1' then stop
      const fn_drawComponentsCanvas = (elapsed) => {
        self.clearCanvas(self)

        if (!firstDraw) {
          self._container.attr('width', self._container.attr('canvas-width'))
          self._container.attr('height', self._container.attr('canvas-height'))
        }

        self._components.forEach(c => c.drawCanvas())

        if (elapsed >= self._transitionObject.duration) self._fn_interval.stop()
      }

      d3.timeout(() => {
        if (self._transitionObject.duration) {
          self._fn_interval = d3.interval(fn_drawComponentsCanvas, 34) // draw every 34 MS
        } else {
          // to render the canvas in the next tick,
          // in order to have correct canvas-width and canvas-height
          self._fn_interval = d3.timeout(fn_drawComponentsCanvas, 0)
        }
      }, self._transitionObject.delay)
    }

    // handling old components
    // self.components.forEach(component => component.group.classed("js__keep-chart-component", true));
    // self.group.selectAll(".component:not(.js__keep-chart-component)").remove(); // may be a problem with nested charts
    // self.components.forEach(component => component.group.classed("js__keep-chart-component", false));
  }
}
