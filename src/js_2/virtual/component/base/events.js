import pipe from 'lodash/fp/flow'
import { event } from 'd3-selection'

const hasEvents = (state = {}) => {
  let fnEvents = s => s

  const self = {
    ...state,
    fnOn: (type, callback) => {
      fnEvents = pipe(fnEvents, s => s.on(type, callback))
    },
    fnEvents: () => {
      return fnEvents
    },
    event: () => {
      return event
    }
  }

  return self
}

export { hasEvents }
