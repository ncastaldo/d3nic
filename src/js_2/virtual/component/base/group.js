import { select } from 'd3-selection'

const hasGroup = (state) => {
  let group = select(null)

  const self = {
    ...state,
    group: () => {
      return group
    }
  }

  const draw = (chart) => {
    group = group.empty() ? chart.group().append('g') : group
  }

  self.subscribe('draw', draw)

  return self
}

export { hasGroup }
