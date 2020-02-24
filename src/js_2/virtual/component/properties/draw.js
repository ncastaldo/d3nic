import pipe from 'lodash/fp/flow'
import * as d3 from '@/js/d3-modules.js'

const hasDraw = (state) => {
  let join = d3.select(null)

  let fnBefore = s => s
  let fnNow = s => s
  let fnAfter = s => s

  const self = {
    ...state,
    join: (value) => {
      if (typeof value === 'undefined') return join
      join = value
    },
    fnBefore: (value) => {
      if (typeof value === 'undefined') return fnBefore
      fnBefore = pipe(fnBefore, value)
    },
    fnNow: (value) => {
      if (typeof value === 'undefined') return fnNow
      fnNow = pipe(fnNow, value)
    },
    fnAfter: (value) => {
      if (typeof value === 'undefined') return fnAfter
      fnAfter = pipe(fnAfter, value)
    }
  }

  return self
}

const hasSingleFunctionDraw = (state) => {
  const self = {
    ...state,
    ...pipe(
      hasDraw
    )(state)
  }

  const fnDraw = (s, chart) => {
    const firstDraw = !s.classed('drawn')

    // remove old element if exists
    firstDraw
      ? s.call(self.fnEvents())
        .call(self.fnStyle())
        .call(self.fnBefore())
        .classed('drawn', true)
        .transition(chart.transition())
        .call(self.fnNow())
      : s.transition(chart.transition())
        .call(self.fnNow())
  }

  const draw = (chart) => {
    self.group().call(fnDraw, chart)

    // joining the group inself
    self.join().empty() && self.join(self.group())
  }

  self.subscribe('draw', draw)

  return self
}

const hasSingleDrawFactory = (element) => (state) => {
  const self = {
    ...state,
    ...pipe(
      hasDraw
    )(state)
  }

  const fnDraw = (s, chart) => {
    const oldElement = s.selectAll(`${element}.drawn`)

    // remove old element if exists
    if (!oldElement.empty()) {
      oldElement.transition(chart.transition())
        .call(self.fnAfter())
        .remove()
    }

    const join = s.datum(chart.data())
      .append(element)
      .call(self.fnEvents())
      .call(self.fnStyle())
      .call(self.fnBefore())
      .classed('drawn', true)
      .transition(chart.transition())
      .call(self.fnStyle())
      .call(self.fnNow())

    // joining the selection
    self.join(join)
  }

  const draw = (chart) => {
    self.group().call(fnDraw, chart)
  }

  self.subscribe('draw', draw)

  return self
}

const hasMultiDrawFactory = (element) => (state) => {
  const self = {
    ...state,
    ...pipe(
      hasDraw
    )(state)
  }

  const fnDraw = (s, chart) => {
    const join = s.join(
      enter => enter
        .append(element)
        .call(self.fnEvents())
        .call(self.fnStyle())
        .call(self.fnBefore())
        .call(enter => enter
          .transition(chart.transition())
          .call(self.fnStyle())
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
          .remove()))
    self.join(join)
  }

  const draw = (chart) => {
    self.group()
      .selectAll(element)
      .data(chart.data(), chart.fnKey())
      .call(fnDraw, chart)
  }

  self.subscribe('draw', draw)

  return self
}

export {
  hasSingleFunctionDraw,
  hasSingleDrawFactory,
  hasMultiDrawFactory
}
