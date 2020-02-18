const hasBars = (state = {}) => {
  let fnLowValue = d => 0
  let fnHighValue = d => d

  let contDomain = [0, 1]

  const self = {
    ...state,
    fnLowValue: (value) => {
      if (typeof value === 'undefined') return fnLowValue
      fnLowValue = value
    },
    fnHighValue: (value) => {
      if (typeof value === 'undefined') return fnHighValue
      fnHighValue = value
    },
    contDomain: () => {
      return contDomain
    }
  }

  const computeContDomain = (chart) => {
    contDomain = chart.data()
      .reduce((domain, d, i) =>
        [
          Math.min(domain[0], Math.min(fnLowValue(d, i), fnHighValue(d, i))),
          Math.max(domain[1], Math.max(fnLowValue(d, i), fnHighValue(d, i)))
        ]
      , [Infinity, -Infinity])
  }

  self.subscribe('computeContDomain', computeContDomain)

  return self
}

export default hasBars
