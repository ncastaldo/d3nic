import { mean } from 'd3-array'

const hasPolar = (state = {}) => {
  const self = {
    ...state,
    center: () => {
      return [
        mean(self.extent(), e => e[0]),
        mean(self.extent(), e => e[1])
      ]
    }
  }

  return self
}

export { hasPolar }
