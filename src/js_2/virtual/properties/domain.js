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
    contDomain = chart.components()
      .filter(c => 'contDomain' in c)
      .map(c => c.publish('computeContDomain', chart))
      .map(c => c.contDomain())
      .reduce((accDomain, curDomain) =>
        [
          Math.min(accDomain[0], curDomain[0]),
          Math.max(accDomain[1], curDomain[1])
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
