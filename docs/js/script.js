
(() => {
  // data

  const fnRandom = d3.randomInt(1, 15)

  const data = [...Array(30).keys()].map(d => ({ key: d, v: fnRandom() }))

  // style

  const width = 400
  const height = 400

  const size = { width, height }
  const viewBox = `0 0 ${width} ${height}`

  const transitionObject = { duration: 1000 }

  const fnFill = d => d3.interpolateViridis(data.length ? 1 - d.key / data.length : 0)

  d3.select('.container').call(container => {
    container.append('svg').classed('brChart', true).attr('viewBox', viewBox).style('width', '100%')
    container.append('svg').classed('bxChart', true).attr('viewBox', viewBox).style('width', '100%')
    container.append('svg').classed('baChart', true).attr('viewBox', viewBox).style('width', '100%')
    container.append('svg').classed('byChart', true).attr('viewBox', viewBox).style('width', '100%')
  })

  // polar

  const brChart = d3nic.brChart()
    .selector('.brChart')
    .size(size)
    .transitionObject(transitionObject)
    .radiusExtent([0.1, 1])
    .angleExtent([-Math.PI, 1 / 2 * Math.PI])
    .fnKey(d => d.key)
    .components([d3nic.brBars().fnLowValue(0)
      .fnHighValue(d => d.v).fnFill(fnFill)])

  const bxChart = d3nic.bxChart()
    .selector('.bxChart')
    .size(size)
    .transitionObject(transitionObject)
    .fnKey(d => d.key).components([
      d3nic.bxLines().fnLowValue(0).fnHighValue(d => d.v).fnStroke(fnFill).fnStrokeWidth(1),
      d3nic.bxCircles().fnValue(d => d.v).fnFill(fnFill)
    ])

  const baChart = d3nic.baChart()
    .selector('.baChart')
    .size(size)
    .transitionObject(transitionObject)
    .radiusExtent([0.1, 1])
    .fnKey(d => d.key)
    .components([d3nic.baBars().fnLowValue(0)
      .fnHighValue(d => d.v).fnFill(fnFill)])

  const byChart = d3nic.byChart()
    .selector('.byChart')
    .size(size)
    .transitionObject(transitionObject)
    .fnKey(d => d.key)
    .components([
      d3nic.byBars().fnLowValue(0).fnHighValue(d => d.v).fnFill(fnFill)
    ])

  const chartList = [brChart, bxChart, baChart, byChart]

  const drawUpdate = () => {
    chartList.map((chart, i) => chart.draw({ delay: i * 500 }))
  }

  const fnUpdate = () => {
    const random1 = d3.randomInt(0, data.length / 2)()
    const random2 = d3.randomInt(data.length / 2, data.length)()
    const newData = data.filter(d => d.key >= random1 && d.key <= random2)

    chartList.map(chart => chart.data(newData))

    drawUpdate()
  }

  fnUpdate()

  setInterval(fnUpdate, 2000)
})()
