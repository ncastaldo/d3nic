
(() => {
  // data

  const dataLength = 30
  
  const fnRandom = d3.randomInt(1, 15)

  const fnRandomMin = d3.randomInt(0, dataLength / 2)
  const fnRandomMax = d3.randomInt(dataLength / 2, dataLength)

  const data = [...Array(dataLength).keys()].map(d => ({ key: d, v: fnRandom() }))

  const duration = 1500
  const delay = 1000
  const interval = 4000

  // style

  const width = 400
  const height = 400

  const size = { width, height }
  const viewBox = `0 0 ${width} ${height}`

  const transitionObject = { duration }

  const fnFill = d => d3.interpolateViridis(data.length ? 1 - d.key / data.length : 0)

  for (const i of [1, 2, 3, 4]) {
    d3.select(`#chart-container-${i}`)
      .append('svg')
      .attr('id', `chart-${i}`)
      .attr('viewBox', viewBox)
      .style('width', '100%')
  }


  // chart 1

  const brBars = d3nic.brBars()
    .fnLowValue(0)
    .fnHighValue(d => d.v)
    .fnFill(fnFill)
    
  const brChart = d3nic.brChart()
    .selector('#chart-1')
    .size(size)
    .transitionObject(transitionObject)
    .radiusExtent([0.1, 1])
    .angleExtent([-Math.PI, 1 / 2 * Math.PI])
    .fnKey(d => d.key)
    .components([brBars])

  // chart 2

  const bxLines = d3nic.bxLines()
    .fnLowValue(0)
    .fnHighValue(d => d.v)
    .fnStroke(fnFill)
    .fnStrokeWidth(1)

  const bxCircles = d3nic.bxCircles()
    .fnValue(d => d.v)
    .fnFill(fnFill)

  const bxChart = d3nic.bxChart()
    .selector('#chart-2')
    .size(size)
    .transitionObject(transitionObject)
    .fnKey(d => d.key)
    .components([ bxLines, bxCircles])

  
  // chart 3

  const baBars = d3nic.baBars()
    .fnLowValue(0)
    .fnHighValue(d => d.v)
    .fnFill(fnFill)

  const baChart = d3nic.baChart()
    .selector('#chart-3')
    .size(size)
    .transitionObject(transitionObject)
    .radiusExtent([0.1, 1])
    .fnKey(d => d.key)
    .components([baBars])


  // chart 4

  const byBars = d3nic.byBars()
    .fnLowValue(0)
    .fnHighValue(d => d.v)
    .fnFill(fnFill)

  const byChart = d3nic.byChart()
    .selector('#chart-4')
    .size(size)
    .transitionObject(transitionObject)
    .fnKey(d => d.key)
    .components([byBars])


  // interaction

  const componentList = [brBars, bxLines, bxCircles, baBars, byBars]
  const chartList = [brChart, bxChart, baChart, byChart]

  // const dispatch = (event, d) => {
  //   for (const component of componentList) {
  //     component.join().filter(f => f.key !== d.key).dispatch(`not-${event.type}`)
  //   }
  // }

  // for (const component of componentList) {
  //   component.fnOn('mouseover', dispatch)
  //   component.fnOn('not-mouseover', (event, d) => d3.select(event.currentTarget).style('opacity', 0.5) )
  //   component.fnOn('mouseout', dispatch)
  //   component.fnOn('not-mouseout', (event, d) => d3.select(event.currentTarget).style('opacity', 1) )
  // }

  const drawUpdate = () => {
    chartList.map((chart, i) => chart.draw({ delay: delay * i}))
  }

  const fnUpdate = () => {
    const min = fnRandomMin()
    const max = fnRandomMax()
    const newData = data.filter(d => d.key >= min && d.key <= max)

    chartList.map(chart => chart.data(newData))

    drawUpdate()
  }

  // start animation
  fnUpdate()
  setInterval(fnUpdate, interval)

})()
