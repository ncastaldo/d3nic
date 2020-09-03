(async () => {

	d3.select(".container").call(container => {
		container.append("svg").classed("svg1", true)
	})


	let circumplex = await d3.json("/resources/circumplexVA.json")
	const fillScale = d3.scaleSequential(d3.interpolatePurples)

	const xyContours = new d3nic.XyContours({
		fn_value: d => [d.v, d.a],
		fn_weight: d => Math.log10(d.count),
		fn_fill: d => fillScale(d.value),
		fn_strokeWidth: d => 0
	})

	const xySymbols = new d3nic.XySymbols({
		fn_value: d => [d.v, d.a],
		fn_fill: d => fillScale(d.value),
		fn_strokeWidth: d => 0
	})

	const xyChart = new d3nic.XyChart(".svg1", {
		size: {width: 400, height: 400},
		padding: {bottom: 40, left: 40},
		transitionObject: {duration: 2000},
		valueDomain: [[0, 19],[0, 19]],
		data: circumplex,
		components: [
			xyContours, xySymbols, new d3nic.XAxis(), new d3nic.YAxis()
		]
	})

	fillScale.domain(d3.extent(xyContours.componentData, d => d.value))
  

	const drawUpdate = () => {

    xyChart.draw()

  }

  const fn_update = (t) => {
    randomNumb = d3.randomInt(0, 100)()
		xyChart.data = circumplex.slice(randomNumb)

		drawUpdate(t);
  }
  
  d3.select('#update').on("click", fn_update)

	drawUpdate()

})()