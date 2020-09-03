(async () => {

	const data = [
		{ key: 0, v1: 4, v2: 9 },
		{ key: 1, v1: 5, v2: 5 },
		{ key: 2, v1: 3, v2: 4 },
		{ key: 3, v1: 3, v2: 8 },
		{ key: 4, v1: 2, v2: 1 },
		{ key: 5, v1: 2, v2: 2 },
		{ key: 6, v1: 6, v2: 8 },
		{ key: 7, v1: 7, v2: 3 },
		{ key: 8, v1: 3, v2: 2 },
		{ key: 9, v1: 6, v2: 2 },
		{ key: 10, v1: 6, v2: 5 },
		{ key: 11, v1: 1, v2: 1 },
		{ key: 12, v1: 3, v2: 7 },
		{ key: 13, v1: 8, v2: 4 },
		{ key: 14, v1: 6, v2: 7 },
		{ key: 15, v1: 9, v2: 5 },
		{ key: 16, v1: 2, v2: 2 },
		{ key: 17, v1: 2, v2: 6 },
		{ key: 18, v1: 4, v2: 7 },
		{ key: 19, v1: 6, v2: 2 },
		{ key: 20, v1: 6, v2: 5 },
		{ key: 21, v1: 1, v2: 1 },
		{ key: 22, v1: 3, v2: 7 },
		{ key: 23, v1: 8, v2: 4 },
		{ key: 24, v1: 6, v2: 7 },
		{ key: 25, v1: 9, v2: 5 },
		{ key: 26, v1: 2, v2: 2 },
		{ key: 27, v1: 2, v2: 6 },
		{ key: 28, v1: 4, v2: 7 },
	];

	const fill = d => d3.interpolateViridis(data.length ? 1-d.key/data.length : 0)
	

	d3.select(".container").call(container => {
		container.append("svg").classed("svg1", true)
		container.append("svg").classed("svg2", true)
	})

	const onMouseover = (event, d) => {
		barsList.map(bars => 
			bars.join().style("opacity", f => d.key!==f.key ? null : 0.5))
	}

	const onMouseout = (event, d) => {
		barsList.map(bars => 
			bars.join().style("opacity", null))
	}

	const barsList = [d3nic.brBars(), d3nic.baBars()]
	const mouseBarsList = [d3nic.brMouseBars(), d3nic.baMouseBars()]
	const chartList =  [d3nic.brChart(), d3nic.baChart()]

	barsList
		.map(bars => 
			bars.lowValue(d => d.v1)
				.highValue(d => d.v1 + d.v2)
				.defined(d => !isNaN(d.v1) && !isNaN(d.v1))
				.fill(fill))

	mouseBarsList
		.map(mouseBars => 
			mouseBars.on('mouseover', onMouseover)
				.on('mouseout', onMouseout))

	chartList
		.map((chart, i) => 
			chart.selector(['.svg1', '.svg2'][i])
				.size({width: 400, height: 500})
				.padding({ top: 0, right: 0, bottom: 0, left: 0 })
				.transitionObject({ duration: 1000 })
				.radiusExtent([0.1, 0.8])
				.angleExtent([1/2 * Math.PI, - Math.PI])
				.fnKey(d => d.key)
				.contBaseDomain([0, null])
				.data(data)
				.components([barsList[i], mouseBarsList[i]]))
	
	
	const drawUpdate = () => {

    chartList.map(chart => chart.draw())

  }

  const fnUpdate = (t) => {
    random1 = d3.randomInt(0, data.length/2)()
    random2 = d3.randomInt(data.length/2, data.length)()
		const newData = data.filter(d => d.key >= random1 && d.key <= random2)
		
		chartList.map(chart => chart.data(newData))

		drawUpdate(t);
  }
  
  d3.select('#update').on("click", fnUpdate)

	drawUpdate()

})()