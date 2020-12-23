(() => {

  const nRange = [20, 30]
  const vRange = [0, 10]

  const fnRandomNumber = d3.randomInt(...nRange)
  const fnRandomValue = d3.randomInt(...vRange)
  
  const fnFill = d => d3.interpolateViridis(d / (vRange[1] - vRange[0] - 1))

	d3.select(".container").call(container => {
		container.append("svg").classed("brChart", true)
		container.append("svg").classed("bars", true)
  })
  
  // polar

  const brChart = d3nic.brChart()
    .selector('.brChart')
    .size({width: 400, height: 500})
    .padding({ top: 0, right: 0, bottom: 0, left: 0 })
    .transitionObject({ duration: 1000 })
    .radiusExtent([0.1, 0.8])
    .angleExtent([Math.PI, 2 / 3 * Math.PI])
    .fnKey((_, i) => i)
    .components([d3nic.brBars().fnLowValue(0).fnHighValue(d => d)])

  const update = () => {
    const number = fnRandomNumber()
    const data = [...Array(number).keys()].map(() => fnRandomValue())

    brChart.data(data).draw()
  }
  
  update()
  
  setInterval(update, 2000)

})()