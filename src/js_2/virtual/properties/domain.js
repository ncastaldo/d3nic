const hasCont = (state = {}) => {
  let contDomain = [0, 1]
  let baseContDomain = [Infinity, -Infinity]

  const self = {
    ...state,
    baseContDomain: (value) => {
      if (typeof value === 'undefined') return baseContDomain
      baseContDomain = value
    },
    contDomain: () => {
      return contDomain
    }
  }

  const updateContDomain = (chart) => {
    const fnsValue = chart.components()
      .map(c => 'fnsValue' in c ? c.fnsValue() : [])
      .flat()

    console.log(fnsValue)

    contDomain = chart.data()
      .reduce((domain, d, i) =>
        [
          Math.min(domain[0], ...fnsValue.map(fn => fn(d, i))),
          Math.max(domain[1], ...fnsValue.map(fn => fn(d, i)))
        ]
      , baseContDomain)
  }

  self.subscribe('data', updateContDomain)
  self.subscribe('components', updateContDomain)

  return self
}

const hasBand = (state = {}) => {
  let fnBandValue = (_, i) => i
  let bandDomain = [0, 1]

  const self = {
    ...state,
    fnBandValue: (value) => {
      if (typeof value === 'undefined') return fnBandValue
      fnBandValue = value
    },
    bandDomain: () => {
      return bandDomain
    }
  }

  // review
  const updateBandDomain = (chart) => {
    bandDomain = chart.data().map(fnBandValue)
  }

  self.subscribe('data', updateBandDomain)
  self.subscribe('components', updateBandDomain)

  return self
}

export { hasBand, hasCont }
