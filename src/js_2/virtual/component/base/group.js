import * as d3 from '@/js/d3-modules.js'

const hasGroup = (state) => {
  let group = d3.select(null)

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
