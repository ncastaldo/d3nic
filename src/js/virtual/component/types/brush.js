import pipe from 'lodash/fp/flow'
import { brushX, brushY } from 'd3-brush'
import { scaleThreshold, scaleOrdinal } from 'd3-scale'

const computeBrush = (on) => {
  return on === 'x' ? brushX() : brushY()
}

const hasBrushFactory = (on = 'x') => (state = {}) => {
  let chartExtent = null

  let onBrush = () => {}
  let onEnd = () => {}

  const self = {
    ...state,
    onBrush (value) {
      if (typeof value === 'undefined') return onBrush
      onBrush = value
    },
    onEnd (value) {
      if (typeof value === 'undefined') return onEnd
      onEnd = value
    },
    fnBrush () {
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
  self.subscribe('data', 'components', 'graphics', update)

  return self
}

const hasBandBrushFactory = (on = 'x') => (state = {}) => {
  let bandDomain = null

  let bandMinStep = null
  let bandMaxStep = null

  const fnScaleT0 = scaleThreshold()
  const fnScaleT1 = scaleThreshold()

  const fnScaleL = scaleOrdinal()
  const fnScaleR = scaleOrdinal()

  const self = {
    ...state,
    ...pipe(
      hasBrushFactory(on)
    )(state),
    bandDomain (value) {
      if (typeof value === 'undefined') return bandDomain
      bandDomain = value
    },
    bandRange () {
      return bandDomain
        ? [fnScaleL(bandDomain[0]), fnScaleR(bandDomain[1])]
        : null
    },
    bandMinStep (value) {
      if (typeof value === 'undefined') return bandMinStep
      bandMinStep = value
    },
    bandMaxStep (value) {
      if (typeof value === 'undefined') return bandMaxStep
      bandMaxStep = value
    },
    snap () {
      self.fnBrush().move(self.group(), self.bandRange())
    }
  }

  const onBrush = (event) => {
    if (!event.selection || !event.sourceEvent || event.sourceEvent.type !== 'mousemove') { return }
    const s = event.selection

    // little trick, using null
    const [d0, dc, d1] = [fnScaleT0(s[0]), fnScaleT0(s[1]), fnScaleT1(s[1])]

    const d = d0 === null || d0 === dc || d1 === null
      ? null : [d0, d1]
    const change = bandDomain !== null
      ? !d || d0 !== bandDomain[0] || d1 !== bandDomain[1]
      : d

    if (change) {
      let update = true

      if (bandMinStep !== null || bandMaxStep !== null) {
        const step = !d
          ? null : d[0] === d[1]
            ? 0 : fnScaleL.domain()
              .reduce((acc, f, i) => f === d[0]
                ? acc - i : f === d[1] ? acc + i : acc, 0)

        update = !(bandMinStep !== null) || (step !== null && step >= bandMinStep)
        update = update && (!(bandMaxStep !== null) || (step === null || step <= bandMaxStep))
      }

      if (update) {
        bandDomain = d
        self.group().datum(d).dispatch('brushBandDomain')
      }
    }

    // snapping
    self.snap()
  }

  const onEnd = (event) => {
    if (!event.sourceEvent || event.sourceEvent.type !== 'mouseup') { return }
    if (!event.selection) {
      if (bandMinStep !== null) {
        self.snap()
      } else {
        bandDomain = null
      }
    }
    self.group()
      .datum(bandDomain)
      .dispatch('endBandDomain')
  }

  self.onBrush(onBrush)
  self.onEnd(onEnd)

  const update = (chart) => {
    const bandScaleDomain = chart.fnBandScale().domain()

    // check everything is fine in case user gives brushDomain
    if (bandScaleDomain) {
      for (const d of bandScaleDomain) {
        if (!bandScaleDomain.includes(d)) {
          bandDomain = null
          break
        }
      }
    }

    const centers = chart.data().map(self.fnBandCenterOut())
    const lefts = chart.data().map(self.fnBandLeftOut())
    const rights = chart.data().map(self.fnBandRightOut())

    // fnScaleT.domain(centers).range(bandDomain)
    fnScaleT0.domain(centers).range([...bandScaleDomain, null])
    fnScaleT1.domain(centers).range([null, ...bandScaleDomain])

    fnScaleL.domain(bandScaleDomain).range(lefts)
    fnScaleR.domain(bandScaleDomain).range(rights)
  }

  // + init
  self.subscribe('draw', update)

  return self
}

const hasContBrushFactory = (on = 'x') => (state = {}) => {
  const self = {
    ...state,
    ...pipe(
      hasBrushFactory(on)
    )(state)
  }

  /* brushSelection() {
    return brushProportion ? brushProportion.map(p => (chartExtent[1][0] - chartExtent[0][0]) * p)
      : null
  }, */

  const onBrush = (event) => {
    if (!event.selection || !event.sourceEvent) { }
    // console.log(event.target)
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
  self.subscribe('data', 'components', 'graphics', update)

  return self
}

export { hasBandBrushFactory, hasContBrushFactory }
