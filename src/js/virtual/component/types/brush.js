import pipe from 'lodash/fp/flow'
import { brushX, brushY } from 'd3-brush'
import { scaleThreshold, scaleOrdinal } from 'd3-scale'

const computeBrush = (on) => {
  return on === 'x' ? brushX() : brushY()
}

const hasBrushFactory = (on = 'x') => (state = {}) => {
  let chartExtent = null

  let brushDomain = null
  let brushRange = null

  let minStep = null
  let maxStep = null

  let onBrush = () => {}
  let onEnd = () => {}

  const self = {
    ...state,
    brushDomain: (value) => {
      if (typeof value === 'undefined') return brushDomain
      brushDomain = value
    },
    brushRange: (value) => {
      if (typeof value === 'undefined') return brushRange
      brushRange = value
    },
    minStep: (value) => {
      if (typeof value === 'undefined') return minStep
      minStep = value
    },
    maxStep: (value) => {
      if (typeof value === 'undefined') return maxStep
      maxStep = value
    },
    onBrush: (value) => {
      if (typeof value === 'undefined') return onBrush
      onBrush = value
    },
    onEnd: (value) => {
      if (typeof value === 'undefined') return onEnd
      onEnd = value
    },
    fnBrush: () => {
      return computeBrush(on)
        .extent(chartExtent)
        .on('brush.d3nic', onBrush)
        .on('end.d3nic', onEnd)
    }
  }

  const update = (chart) => {
    chartExtent = chart.extent()
  }

  // + init
  self.subscribe('data', update)
  self.subscribe('components', update)
  self.subscribe('size', update)
  self.subscribe('padding', update)

  return self
}

const hasBandBrushFactory = (on = 'x') => (state = {}) => {
  const fnScaleT0 = scaleThreshold()
  const fnScaleT1 = scaleThreshold()

  const fnScaleL = scaleOrdinal()
  const fnScaleR = scaleOrdinal()

  const self = {
    ...state,
    ...pipe(
      hasBrushFactory(on)
    )(state)
  }

  const snap = () => {
    self.fnBrush().move(self.group(), self.brushRange())
  }

  const onBrush = (event) => {
    if (!event.selection || !event.sourceEvent || event.sourceEvent.type !== 'mousemove') { return }
    const s = event.selection

    const brushDomain = self.brushDomain()

    // little trick, using null
    const [d0, dc, d1] = [fnScaleT0(s[0]), fnScaleT0(s[1]), fnScaleT1(s[1])]

    const d = d0 === null || d0 === dc || d1 === null
      ? null : [d0, d1]
    const change = brushDomain !== null
      ? !d || d0 !== brushDomain[0] || d1 !== brushDomain[1]
      : d

    if (change) {
      let update = true

      const minStep = self.minStep()
      const maxStep = self.maxStep()

      if (minStep !== null || maxStep !== null) {
        const step = !d
          ? null : d[0] === d[1]
            ? 0 : fnScaleL.domain()
              .reduce((acc, f, i) => f === d[0]
                ? acc - i : f === d[1] ? acc + i : acc, 0)

        update = !(minStep !== null) || (step !== null && step >= minStep)
        update = update && (!(maxStep !== null) || (step === null || step <= maxStep))
      }

      if (update) {
        self.brushDomain(d)
        updateBrushRange()

        self.group().datum(d).dispatch('brushDomain')
      }
    }

    // snapping
    snap()
  }

  const onEnd = (event) => {
    if (!event.sourceEvent || event.sourceEvent.type !== 'mouseup') { return }
    if (!event.selection) {
      if (self.minStep() !== null) {
        snap()
      } else {
        self.brushDomain(null)
      }
    }
    self.group().datum(self.brushDomain()).dispatch('endDomain')
  }

  self.onBrush(onBrush)
  self.onEnd(onEnd)

  const update = (chart) => {
    const bandDomain = chart.fnBandScale().domain()

    // check everything is fine in case user gives brushDomain
    if (self.brushDomain()) {
      for (const d of self.brushDomain()) {
        if (!bandDomain.includes(d)) {
          self.brushDomain(null)
          break
        }
      }
    }

    const centers = chart.data().map(self.fnBandCenterOut())
    const lefts = chart.data().map(self.fnBandLeftOut())
    const rights = chart.data().map(self.fnBandRightOut())

    // fnScaleT.domain(centers).range(bandDomain)
    fnScaleT0.domain(centers).range([...bandDomain, null])
    fnScaleT1.domain(centers).range([null, ...bandDomain])

    fnScaleL.domain(bandDomain).range(lefts)
    fnScaleR.domain(bandDomain).range(rights)

    updateBrushRange()
  }

  const updateBrushRange = () => {
    const d = self.brushDomain()
    const r = d ? [fnScaleL(d[0]), fnScaleR(d[1])] : null
    self.brushRange(r)
  }

  // + init
  self.subscribe('data', 'components', 'size', 'padding', update)
  self.subscribe('brushDomain', updateBrushRange)

  return self
}

const hasContBrushFactory = (on = 'x') => (state = {}) => {
  const self = {
    ...state,
    ...pipe(
      hasBrushFactory(on)
    )(state)
  }

  /* brushSelection: () => {
    return brushProportion ? brushProportion.map(p => (chartExtent[1][0] - chartExtent[0][0]) * p)
      : null
  }, */

  const onBrush = (event) => {
    if (!event.selection || !event.sourceEvent) { return }
    console.log(event.target)
  }

  /* const onEnd = () => {
    if (!event.selection || !event.sourceEvent) { return }
    brushProportion = event.selection
      .map(e => e / (chartExtent[1][0] - chartExtent[0][0]))
  } */

  self.onBrush(onBrush)
  // self.onEnd(onEnd)

  const update = (chart) => {
    // translateAxis = computeTranslate(chart, on, position)
  }

  // + init
  self.subscribe('data', 'components', 'size', 'padding', update)

  return self
}

export { hasBandBrushFactory, hasContBrushFactory }
