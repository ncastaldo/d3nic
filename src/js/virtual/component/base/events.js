import pipe from 'lodash/fp/flow'

const hasEvents = (state = {}) => {
  let fnEvents = s => s

  const self = {
    ...state,
    on: (type, callback) => {
      fnEvents = pipe(fnEvents, s => s.on(type, callback))
    },
    fnEvents () {
      return fnEvents
    }
  }

  return self
}

export { hasEvents }
