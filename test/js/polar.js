(async () => {

	const data = [
		{ key: 0, v: 4},
		{ key: 1, v: 5 },
		{ key: 2, v: 3 },
		{ key: 3, v: 3 },
		{ key: 4, v: 2 },
		{ key: 5, v: 2 },
		{ key: 6, v: 6 },
		{ key: 7, v: 7 },
		{ key: 8, v: 3 },
		{ key: 9, v: 11 },
		{ key: 10, v: 6 },
		{ key: 11, v: 1 },
		{ key: 12, v: 3 },
		{ key: 13, v: 8 },
		{ key: 14, v: 6 },
		{ key: 15, v: 9 },
		{ key: 16, v: 2 },
		{ key: 17, v: 2 },
		{ key: 18, v: 4 },
		{ key: 19, v: 6 },
		{ key: 20, v: 6 },
		{ key: 21, v: 1 },
		{ key: 22, v: 3 },
		{ key: 23, v: 8 },
		{ key: 24, v: 13 },
		{ key: 25, v: 9 },
		{ key: 26, v: 2 },
		{ key: 27, v: 2 },
		{ key: 28, v: 4 },
	];

	const fnFill = d => d3.interpolateViridis(data.length ? 1-d.key/data.length : 0)
	

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
			bars.fnLowValue(d => d.v)
				.fnHighValue(d => d.v)
				.fnDefined(d => !isNaN(d.v) && !isNaN(d.v))
				.fnFill(fnFill))

	mouseBarsList
		.map(mouseBars => 
			mouseBars.fnOn('mouseover', onMouseover)
				.fnOn('mouseout', onMouseout))

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