import pipe from 'lodash/fp/flow'

const hasDraw = (state) => {
  let fnBefore = s => s
  let fnNow = s => s
  let fnAfter = s => s

  const self = {
    ...state,
    fnBefore: (value) => {
      if (typeof value === 'undefined') return fnBefore
      fnBefore = value
    },
    fnNow: (value) => {
      if (typeof value === 'undefined') return fnNow
      fnNow = value
    },
    fnAfter: (value) => {
      if (typeof value === 'undefined') return fnAfter
      fnAfter = value
    }
  }

  return self
}

const hasMultiDraw = (state) => {
  let element = 'rect'

  const self = {
    ...state,
    ...pipe(
      hasDraw
    )(state),
    element: (value) => {
      if (typeof value === 'undefined') return element
      element = value
    }
  }

  const fnDraw = (s, chart) => s.join(
    enter => enter
      .append(element)
      .call(self.fnStyle())
      .call(self.fnBefore())
      .call(enter => enter
        .transition(chart.transition())
        .call(self.fnNow())
      ),
    update => update
      .call(update =>
        update.transition(chart.transition())
          .call(self.fnStyle())
          .call(self.fnNow())
      ),
    exit => exit
      .call(exit => exit
        .transition(chart.transition())
        .call(self.fnAfter())
        .remove())
  )

  const draw = (chart) => {
    self.group()
      .selectAll(element)
      .data(chart.data(), chart.fnKey())
      .call(fnDraw, chart)
  }

  self.subscribe('draw', draw)

  return self
}

export { hasMultiDraw }
