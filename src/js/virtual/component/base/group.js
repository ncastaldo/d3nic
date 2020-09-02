import { select } from 'd3-selection'

const hasGroup = (state) => {
  let extent
  let group = select(null)

  const self = {
    ...state,
    extent () {
      return extent
    },
    group () {
      return group
    }
  }

  const update = (chart) => {
    extent = chart.extent()
    group = group.empty() ? chart.group().append('g') : group
  }

  self.subscribe('draw', update)

  return self
}

export { hasGroup }
