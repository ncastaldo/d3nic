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

	const fn_fill = d => d3.interpolateViridis(data.length ? 1-d.key/data.length : 0)
	

	d3.select(".container").call(container => {
		container.append("svg").classed("svg1", true)
		container.append("svg").classed("svg2", true)
		container.append("svg").classed("svg3", true)
	})

	const mouseoverBisector = (d) => {
		bandVLines.join.style("opacity", f => d.key===f.key ? 1 : null)
	}

	const mouseoutBisector = (d) => {
		bandVLines.join.style("opacity", null)
		bandBars.join.style("opacity", null)
	}

	const bandVLines = new d3nic.BandVLines({
		fn_bottomValue: d => d.v1,
		fn_topValue: d => d.v1 + d.v2,
		fn_defined: d => !isNaN(d.v1) && !isNaN(d.v2),
		fn_opacity: d => 0,
		fn_strokeWidth: d => 2
	})

	const bandSymbols = new d3nic.BandSymbols({
		fn_value: d => d.v1,
		fn_defined: d => !isNaN(d.v1),
		fn_size: d => 70,
		fn_type: (d, i) => i%2 ? d3.symbolWye : d3.symbolSquare,
		fn_fill: d => "red",
		phi: 0.2
	})

	const bandChart = new d3nic.BandChart(".svg1", {
		padding: { top: 50, right: 50, bottom: 50, left: 50 },
		size: {width: 800, height: 400},
		transitionObject: { duration: 2000 },
		fn_key: (d, i) => d.key,
		valueDomain: [0, NaN],
		data: data,
		components: [
			new d3nic.BandAxis({ position: 'bottom', ticks: 10, tickFormat: d => d }),
			new d3nic.YAxis({ position: 'left' }),
			bandVLines,
			new d3nic.BandLine({
				fn_value: d => d.v1 + d.v2,
				fn_defined: d => !isNaN(d.v1) && !isNaN(d.v2),
				fn_strokeWidth: 3
			}),
			new d3nic.BandArea({
				fn_topValue: d => d.v1,
				fn_defined: d => !isNaN(d.v1),
				fn_fill: d3.schemeReds[9][4],
			}),
			new d3nic.BandLine({
				fn_value: d => d.v1,
				fn_defined: d => !isNaN(d.v1),
				fn_stroke: d3.schemeReds[9][6],
				fn_strokeWidth: 3
			}),
			bandSymbols,
			new d3nic.BandBisector({
				fn_onMouseoverAction: mouseoverBisector,
				fn_onMouseoutAction: mouseoutBisector,
			}),
		]
	})

	const fn_onBrushAction = brushKeys => {
		// console.log(JSON.stringify(brushKeys))
		bandBars.join.style("fill-opacity", d => brushKeys && d.key >= brushKeys[0] && d.key <= brushKeys[1] ? null : 0.2)
		//fn_update(brushData)
	}	
	
	const fn_onEndAction = brushKeys => {
		fn_update(brushKeys, {duration: 1000});
	}


	const bandBars = new d3nic.BandBars({
		// fn_bottomValue: d => d.v1,
		fn_topValue: d => d.v1+d.v2,
		fn_defined: d => !isNaN(d.v1) && !isNaN(d.v2),
		fn_strokeWidth: d => 0,
		fn_fill: fn_fill,
		phi: 0.2
	})

	const bandBrusher = new d3nic.BandBrusher({
		fn_onBrushAction: fn_onBrushAction,
		fn_onEndAction: fn_onEndAction
	})

	const bandBrushChart = new d3nic.BandChart(".svg2", {
		padding: { top: 50, right: 50, bottom: 50, left: 50 },
		transitionObject: { duration: 1000 },
		bandPadding: { inner: 0, outer: 0},
		size: { width: 700 },
		fn_key: d => d.key,
		valueDomain: [0, NaN],
		data: data,
		components: [
			new d3nic.BandAxis(), bandBars, bandBrusher
		]
	})

	const bandStatisticChart = new d3nic.BandChart(".svg3", {
		padding: { top: 50, right: 50, bottom: 50, left: 50 },
		transitionObject: { duration: 4000 },
		bandPadding: { inner: 0.5, outer: 0.5 },
		size: { width: 400 },
		fn_key: d => d.key,
		valueDomain: [0, NaN],
		data: data,
		components: [
			new d3nic.BandAxis({ tickSizeInner: 0, tickSizeOuter: 0 }),
			new d3nic.YAxis({ tickSizeInner: 0, tickSizeOuter: 0 }),
			new d3nic.BandBoxPlots({
				fn_minValue: d => d.v1 - 2,
				fn_q1Value: d => d.v1 - 1,
				fn_medianValue: d => d.v1,
				fn_q3Value: d => d.v1 + 1,
				fn_maxValue: d => d.v1 + 2,
				fn_defined: d => !isNaN(d.v1),
				// fn_minWidth: d => 10,
				// fn_maxWidth: d => 30,
				fn_fill: fn_fill,
				fn_fillOpacity: d => 0.5,
				fn_stroke: fn_fill,
				fn_strokeWidth: d => 2,
			}),
			new d3nic.BandLine({
				fn_value: d => d.v1,
				fn_defined: d => !isNaN(d.v1),
				fn_strokeWidth: d => 2,
				fn_stroke: d => "#555",
				fn_strokeDasharray: d => [4, 1]
			}),
		]
  })
  


	const drawUpdate = () => {

    bandStatisticChart.draw()
    bandChart.draw()

  }

  const fn_update = (brushKeys, t) => {
		const newData = data.filter(d => d.key >= brushKeys[0] && d.key <= brushKeys[1])
		bandChart.data = newData;
		bandStatisticChart.data = newData;

		drawUpdate(t);
  }

  bandBrushChart.draw()

	drawUpdate()


})()