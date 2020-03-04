import pipe from 'lodash/fp/flow'
import { axisBottom, axisTop, axisLeft, axisRight } from 'd3-axis'
import { format } from 'd3-format'

const computeAxis = (on, position) => {
  return on === 'x'
    ? position === 'top' ? axisTop() : axisBottom()
    : position === 'right' ? axisRight() : axisLeft()
}

const computeTranslate = (chart, on, position) => {
  const tx = on === 'y'
    ? position === 'right'
      ? chart.size().width - chart.padding().right
      : chart.padding().left
    : 0
  const ty = on === 'x'
    ? position === 'bottom'
      ? chart.size().height - chart.padding().bottom
      : chart.padding().top
    : 0
  return `translate(${tx},${ty})`
}

const hasAxisFactory = (on = 'x') => (state = {}) => {
  let ticks = 5
  let tickFormat = format('.1f')
  let tickSizeInner = 6
  let tickSizeOuter = 6
  let tickPadding = 8

  let position = on === 'x' ? 'bottom' : 'left'

  let translateAxis
  let fnAxis

  const self = {
    ...state,
    ticks: (value) => {
      if (typeof value === 'undefined') return ticks
      ticks = value
      fnAxis.ticks(ticks)
    },
    tickFormat: (value) => {
      if (typeof value === 'undefined') return tickFormat
      tickFormat = value
      fnAxis.tickFormat(tickFormat)
    },
    tickSizeInner: (value) => {
      if (typeof value === 'undefined') return tickSizeInner
      tickSizeInner = value
      fnAxis.tickSizeInner(tickSizeInner)
    },
    tickSizeOuter: (value) => {
      if (typeof value === 'undefined') return tickSizeOuter
      tickSizeOuter = value
      fnAxis.tickSizeOuter(tickSizeOuter)
    },
    tickPadding: (value) => {
      if (typeof value === 'undefined') return tickPadding
      tickPadding = value
      fnAxis.tickPadding(tickPadding)
    },
    position: (value) => {
      if (typeof value === 'undefined') return position
      position = value
      changeAxis()
    },
    translateAxis: () => {
      return translateAxis
    },
    fnAxis: () => {
      return fnAxis
    }
  }

  // AWFUL SOLUTION
  self.fnStrokeWidth(1)
  self.fnStroke('none')

  const changeAxis = () => {
    fnAxis = computeAxis(on, position)
      .ticks(ticks)
      .tickFormat(tickFormat)
      .tickSizeInner(tickSizeInner)
      .tickSizeOuter(tickSizeOuter)
      .tickPadding(tickPadding)
  }

  // subscription to self call on modified proxy for component
  // self.subscribe('position', changeAxis)

  changeAxis()

  const updateTranslate = (chart) => {
    translateAxis = computeTranslate(chart, on, position)
  }

  // + init
  self.subscribe('data', updateTranslate)
  self.subscribe('components', updateTranslate)
  self.subscribe('size', updateTranslate)
  self.subscribe('padding', updateTranslate)

  return self
}

const hasBandAxisFactory = (on = 'x') => (state = {}) => {
  const self = {
    ...state,
    ...pipe(
      hasAxisFactory(on)
    )(state)
  }

  const updateTicks = () => {
    const domain = self.fnAxis().scale().domain()

    if (self.ticks() <= 0) return domain

    const fnRecursive = (tot, max, j) => {
      if (tot / j <= max) return j
      return fnRecursive(tot, max, j + 1)
    }

    const j = fnRecursive(domain.length, self.ticks(), 1)
    const correction = Math.floor((domain.length - 1) % j / 2) // how many on the right -> shift in case
    const fnFilterDomain = (_, i) => i % j === correction

    self.fnAxis().tickValues(domain.filter(fnFilterDomain)) // won't call the proxy since the function itself is modified
  }

  const updateAxisScale = (chart) => {
    self.fnAxis().scale(chart.fnBandScale())
    updateTicks() // a scale is needed
  }

  // init may be enough
  self.subscribe('data', updateAxisScale)
  self.subscribe('components', updateAxisScale)
  self.subscribe('size', updateAxisScale)
  self.subscribe('padding', updateAxisScale)

  return self
}

const hasContAxisFactory = (on = 'x') => (state = {}) => {
  const self = {
    ...state,
    ...pipe(
      hasAxisFactory(on)
    )(state)
  }

  const updateAxisScale = (chart) => {
    self.fnAxis().scale(chart.fnContScale())
  }

  // init may be enough
  self.subscribe('data', updateAxisScale)
  self.subscribe('components', updateAxisScale)
  self.subscribe('size', updateAxisScale)
  self.subscribe('padding', updateAxisScale)

  return self
}

export { hasBandAxisFactory, hasContAxisFactory }
