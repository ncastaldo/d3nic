'use strict'

/*
 *	An empty chart
 */
export function xyChart () {
  /** * VARIABLES ***/

  // direction
  let horizontal = true

  // view parameters
  let width = 300
  let height = 200
  let padding = { top: 30, right: 30, bottom: 30, left: 30 }

  // value domain
  let valueDomain = [NaN, NaN]

  // scales
  let xScale = d3.scaleLinear
  let yScale = d3.scaleLinear

  // axes
  let xAxisVisible = true
  let yAxisVisible = true

  let xTicks = 10
  let yTicks = 10

  let xTickFormat = d3.format('s')
  let yTickFormat = d3.format('s')

  // elements
  const elements = []

  // data
  let data = []

  // data functions
  let fn_data = data => data
  let fn_key = (d, i) => i

  // generic call function
  let fn_call = selection => {}

  /** * HANDLERS ***/

  // helper functions
  function getValueDomain (data, elements) {
    const tmpValueDomain = [
      isNaN(valueDomain[0]) ? Number.POSITIVE_INFINITY : valueDomain[0],
      isNaN(valueDomain[1]) ? Number.NEGATIVE_INFINITY : valueDomain[1]
    ]

    elements.filter(el => el.fn_value)
      .forEach(el => {
        tmpValueDomain[0] = d3.min([tmpValueDomain[0], d3.min(data, el.fn_value())])
        tmpValueDomain[1] = d3.max([tmpValueDomain[1], d3.max(data, el.fn_value())])
      })

    return tmpValueDomain
  }

  // update functions
  let fn_updateData

  /** * SELF FUNCTION ***/

  function self (selection) {
    selection.each(function () {
      /** * CALCULA ***/

      let keyDomain = d3.extent(data, fn_key)
      let _valueDomain = getValueDomain(data, elements)

      //	scales
      const fn_xScale = xScale()
        .range([padding.left, width - padding.right])
        .domain(horizontal ? keyDomain : _valueDomain)

      const fn_yScale = yScale()
        .range([height - padding.bottom, padding.top])
        .domain(horizontal ? _valueDomain : keyDomain.reverse())

      //	axes
      const fn_xAxis = d3.axisBottom()
        .scale(fn_xScale)
        .ticks(xTicks)
        .tickFormat(xTickFormat)
        .tickSizeInner(0)
        .tickSizeOuter(0)
        .tickPadding(8)

      const fn_yAxis = d3.axisLeft()
        .scale(fn_yScale)
        .ticks(yTicks)
        .tickFormat(yTickFormat)
        .tickSizeOuter(0)

      /** * DRAWING ***/

      //	svg
      const svg = d3
        .select(this)
        .append('svg')
        .attr('width', width)
        .attr('height', height)

      svg.call(fn_call)

      //	elements
      elements.forEach(el => {
        el.horizontal(horizontal)
          .fn_xScale(fn_xScale)
          .fn_yScale(fn_yScale)
          .fn_key(fn_key)
          .data(data)

        svg.call(el)
      })

      //	axes
      const xAxis = svg
        .append('g')
        .classed('axis axis--x', true)
        .attr('transform', 'translate(0, ' + (height - padding.bottom) + ')')

      const yAxis = svg
        .append('g')
        .classed('axis axis--y', true)
        .attr('transform', 'translate(' + padding.left + ', 0)')

      xAxisVisible ? xAxis.call(fn_xAxis).moveToBack() : {}
      yAxisVisible ? yAxis.call(fn_yAxis).moveToBack() : {}

      /** * UPDATES ***/

      fn_updateData = function () {
        /** * CALCULA ***/

        keyDomain = d3.extent(data, fn_key)
        _valueDomain = getValueDomain(data, elements)

        //	scales
        fn_xScale.domain(horizontal ? keyDomain : _valueDomain)
        fn_yScale.domain(horizontal ? _valueDomain : keyDomain.reverse())

        //	axes
        fn_xAxis.scale(fn_xScale)
        fn_yAxis.scale(fn_yScale)

        /** * DRAWING ***/

        //	elements
        elements.forEach(el => {
          el.fn_xScale(fn_xScale)
            .fn_yScale(fn_yScale)
            .data(data)
        })

        const t = d3.transition().duration(500)

        //	axes
        xAxisVisible ? xAxis.moveToBack().transition(t).call(fn_xAxis) : {}
        yAxisVisible ? yAxis.moveToBack().transition(t).call(fn_yAxis) : {}
      }
    })
  }

  /** * GETTERS/SETTERS ***/

  // direction
  self.horizontal = function (value) {
    if (!arguments.length) return horizontal
    horizontal = value
    return self
  }

  // 	view parameters
  self.width = function (value) {
    if (!arguments.length) return width
    width = value
    return self
  }

  self.height = function (value) {
    if (!arguments.length) return height
    height = value
    return self
  }

  self.padding = function (value) {
    if (!arguments.length) return padding
    padding = value
    return self
  }

  // value domain
  self.valueDomain = function (value) {
    if (!arguments.length) return valueDomain
    valueDomain = value
    return self
  }

  // scales
  self.xScale = function (value) {
    if (!arguments.length) return xScale
    xScale = value
    return self
  }

  self.yScale = function (value) {
    if (!arguments.length) return yScale
    yScale = value
    return self
  }

  // axes

  self.xAxisVisible = function (value) {
    if (!arguments.length) return xAxisVisible
    xAxisVisible = value
    return self
  }

  self.yAxisVisible = function (value) {
    if (!arguments.length) return yAxisVisible
    yAxisVisible = value
    return self
  }

  self.xTicks = function (value) {
    if (!arguments.length) return xTicks
    xTicks = value
    return self
  }

  self.yTicks = function (value) {
    if (!arguments.length) return yTicks
    yTicks = value
    return self
  }

  self.xTickFormat = function (value) {
    if (!arguments.length) return xTickFormat
    xTickFormat = value
    return self
  }

  self.yTickFormat = function (value) {
    if (!arguments.length) return yTickFormat
    yTickFormat = value
    return self
  }

  //	elements
  self.pushElement = function (el) {
    elements.push(el)
    return self
  }

  self.pushElements = function (els) {
    els.forEach(el => self.pushElement(el))
    return self
  }

  // 	data
  self.data = function (value) {
    if (!arguments.length) return data
    data = fn_data(value)
    if (typeof fn_updateData === 'function') fn_updateData()
    return self
  }

  // 	data functions
  self.fn_data = function (value) {
    if (!arguments.length) return fn_data
    fn_data = value
    return self
  }

  self.fn_key = function (value) {
    if (!arguments.length) return fn_key
    fn_key = value
    return self
  }

  // generic call function
  self.fn_call = function (value) {
    if (!arguments.length) return fn_call
    fn_call = value
    return self
  }

  return self
}
