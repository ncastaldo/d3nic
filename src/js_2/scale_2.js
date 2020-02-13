import * as d3 from '@/js/d3-modules.js'

const hasChart = (state) => {
  let chart
  const self = {
    ...state,
    chart: (value) => {
      if (typeof value === 'undefined') return chart
      chart = value
      return self
    }
  }
  return self
}

const hasAxis = (state) => {
  let axisDomain = [NaN, NaN]

  const self = {
    ...state,
    ...hasChart(state),
    axisDomain: (value) => {
      if (typeof value === 'undefined') return axisDomain
      axisDomain = value
      return self
    },
    getAxisDomain () {
      return self.chart().components()
        .map(component =>
          self.chart().data()
            .map(d => component.bxValue(d))
            .reduce((axisDomain, axisValue) => [
              Math.min(axisDomain[0], axisValue),
              Math.max(axisDomain[1], axisValue)
            ], axisDomain))
        .reduce((axisDomain, axisValuePair) => [
          Math.min(axisDomain[0], axisValuePair[0]),
          Math.max(axisDomain[1], axisValuePair[1])
        ], axisDomain)
    }
  }
  return self
}

const hasXAxis = (state) => {
  const self = {
    ...state,
    ...hasAxis(state),
    getAxisRange: () => {
      return self.chart().extent().map(point => point[0])
    }
  }
  return self
}

const hasYAxis = (state) => {
  const self = {
    ...state,
    ...hasAxis(state),
    getAxisRange: () => {
      return self.chart().extent().map(point => point[1])
    }
  }
  return self
}

const fn_bxScale = (state) => {
  const fn_scale = d3.scaleBand()

  const self = {
    ...state,
    ...hasXAxis,
    fn_scale: () => {
      return fn_scale
    },
    update: () => {
      fn_scale
        .domain(self.getDomain())
        .range(self.getRange())
    }
  }

  return self
}

const fn_yScale = (state) => {
  let scale = 'scaleLinear'

  // consider how to change it
  const fn_scale = d3[scale]

  const self = {
    ...state,
    ...hasYAxis,
    scale: (value) => {
      if (typeof value === 'undefined') return scale
      scale = value
      return self
    },
    fn_scale: () => {
      return fn_scale
    },
    update: () => {
      fn_scale
        .domain(self.getAxisDomain())
        .range(self.getAxisRange())
    }
  }

  return self
}

export { fn_bxScale, fn_yScale }
