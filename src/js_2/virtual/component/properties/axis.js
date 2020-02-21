import pipe from 'lodash/fp/flow'
import * as d3 from '@/js/d3-modules.js'

const computeAxis = (on, position) => {
  return on === 'x'
    ? position === 'top' ? d3.axisTop() : d3.axisBottom()
    : position === 'right' ? d3.axisRight() : d3.axisLeft()
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
  let tickFormat = d3.format('.1f')
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
    },
    tickFormat: (value) => {
      if (typeof value === 'undefined') return tickFormat
      tickFormat = value
    },
    tickSizeInner: (value) => {
      if (typeof value === 'undefined') return tickSizeInner
      tickSizeInner = value
    },
    tickSizeOuter: (value) => {
      if (typeof value === 'undefined') return tickSizeOuter
      tickSizeOuter = value
    },
    tickPadding: (value) => {
      if (typeof value === 'undefined') return tickPadding
      tickPadding = value
    },
    position: (value) => {
      if (typeof value === 'undefined') return position
      position = value
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
      .ticks(self.ticks())
      .tickFormat(self.tickFormat())
      .tickSizeInner(self.tickSizeInner())
      .tickSizeOuter(self.tickSizeOuter())
      .tickPadding(self.tickPadding())
  }

  // subscription to self call on modified proxy for component
  self.subscribe('position', changeAxis)

  // just to init
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

  const updateAxisScale = (chart) => {
    self.fnAxis().scale(chart.fnBandScale())
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
