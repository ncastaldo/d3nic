(() => {

  const nRange = [20, 30]
  const vRange = [0, 10]

  const fnRandomNumber = d3.randomInt(...nRange)
  const fnRandomValue = d3.randomInt(...vRange)
  
  const fnFill = d => d3.interpolateBlues(d / (vRange[1] - vRange[0] - 1))

	d3.select(".container").call(container => {
    container.append("svg").classed("brChart", true)
    container.append("svg").classed("baChart", true)
    container.append('div').style('text-align', 'center').append("svg").classed("bxChart", true)
  })
  
  // polar

  const brChart = d3nic.brChart()
    .selector('.brChart')
    .size({width: 350, height: 350})
    .transitionObject({ duration: 1000 })
    .radiusExtent([0.1, 1])
    .angleExtent([-Math.PI, 1 / 2 * Math.PI])
    .fnKey((_, i) => i)
    .components([d3nic.brBars().fnLowValue(0).fnHighValue(d => d).fnFill(fnFill)])

  const baChart = d3nic.baChart()
    .selector('.baChart')
    .size({width: 350, height: 350})
    .transitionObject({ duration: 1000 })
    .radiusExtent([0.1, 1])
    .fnKey((_, i) => i)
    .components([d3nic.baBars().fnLowValue(0).fnHighValue(d => d).fnFill(fnFill)])


  const bxChart = d3nic.bxChart()
    .selector('.bxChart')
    .size({width: 350, height: 350})
    .transitionObject({ duration: 1000 })
    .fnKey((_, i) => i)
    .components([d3nic.bxBars().fnLowValue(0).fnHighValue(d => d).fnFill(fnFill)])


  const update = () => {
    const number = fnRandomNumber()
    const data = [...Array(number).keys()].map(() => fnRandomValue())

    brChart.data(data).draw()
    baChart.data(data).draw()
    bxChart.data(data).draw()
  }
  
  update()
  
  setInterval(update, 1000)

})()