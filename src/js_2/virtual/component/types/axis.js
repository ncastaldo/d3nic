import pipe from 'lodash/fp/flow'
import { axisBottom, axisTop, axisLeft, axisRight } from 'd3-axis'
import { axisRadialInner, axisRadialOuter } from 'd3-radial-axis'
import { format } from 'd3-format'

const computeAxis = (on, position) => {
  return on === 'x'
    ? position === 'top' ? axisTop() : axisBottom()
    : on === 'y'
      ? position === 'right' ? axisRight() : axisLeft()
      : on === 'angle'
        ? position === 'inner' ? axisRadialInner() : axisRadialOuter()
        : undefined
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
  let tickValues = null
  let tickFormatType = null // null, if defined then dominant
  let tickFormat = t => t
  let tickSizeInner = 6
  let tickSizeOuter = 6
  let tickPadding = 8

  let position = on === 'x' ? 'bottom' : 'left'
  let scale = null

  let translateAxis = null

  const self = {
    ...state,
    ticks: (value) => {
      if (typeof value === 'undefined') return ticks
      ticks = value
    },
    tickValues: (value) => {
      if (typeof value === 'undefined') return tickValues
      tickValues = value
    },
    tickFormatType: (value) => {
      if (typeof value === 'undefined') return tickFormatType
      tickFormatType = value
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
    scale: (value) => {
      if (typeof value === 'undefined') return scale
      scale = value
    },
    translateAxis: () => {
      return translateAxis
    },
    fnAxis: () => {
      const fnAxis = computeAxis(on, position)
        .ticks(ticks)
        .tickValues(tickValues)
        .tickFormat(tickFormatType ? format(tickFormatType) : tickFormat)
        .tickSizeInner(tickSizeInner)
        .tickSizeOuter(tickSizeOuter)
        .tickPadding(tickPadding)
      return on !== 'angle'
        ? fnAxis.scale(scale)
        : fnAxis.angleScale(scale)
          .radius(self.radiusRange()[position === 'inner' ? 0 : 1])
    }
  }

  // AWFUL SOLUTION
  self.fnStrokeWidth(1)
  self.fnStroke('none')

  const update = (chart) => {
    translateAxis = computeTranslate(chart, on, position)
  }

  // + init
  self.subscribe('data', update)
  self.subscribe('components', update)
  self.subscribe('size', update)
  self.subscribe('padding', update)

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
    const domain = self.scale().domain()

    if (self.ticks() <= 0) return domain

    const fnRecursive = (tot, max, j) => {
      if (tot / j <= max) return j
      return fnRecursive(tot, max, j + 1)
    }

    const j = fnRecursive(domain.length, self.ticks(), 1)
    const correction = Math.floor((domain.length - 1) % j / 2) // how many on the right -> shift in case
    const fnFilterDomain = (_, i) => i % j === correction

    self.tickValues(domain.filter(fnFilterDomain)) // won't call the proxy since the function itself is modified
  }

  const updateAxisScale = (chart) => {
    self.scale(chart.fnBandScale())
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
    self.scale(chart.fnContScale())
  }

  // init may be enough
  self.subscribe('data', updateAxisScale)
  self.subscribe('components', updateAxisScale)
  self.subscribe('size', updateAxisScale)
  self.subscribe('padding', updateAxisScale)

  return self
}

const hasDoubleContAxisFactory = (on = 'x', index = 0) => (state = {}) => {
  const self = {
    ...state,
    ...pipe(
      hasAxisFactory(on)
    )(state)
  }

  const updateAxisScale = (chart) => {
    self.scale(chart.fnDoubleContScale()(index))
  }

  // init may be enough
  self.subscribe('data', updateAxisScale)
  self.subscribe('components', updateAxisScale)
  self.subscribe('size', updateAxisScale)
  self.subscribe('padding', updateAxisScale)

  return self
}

export {
  hasBandAxisFactory,
  hasContAxisFactory,
  hasDoubleContAxisFactory
}
