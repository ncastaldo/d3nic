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
	})

	const mouseoverBisector = (d) => {
		arcBars.join.style("opacity", f => d.key!==f.key ? 0.5 : null)
		sectorBars.join.style("opacity", f => d.key!==f.key ? 0.5 : null)
	}

	const mouseoutBisector = (d) => {
		arcBars.join.style("opacity", null)
		sectorBars.join.style("opacity", null)
	}
	const arcBars = new d3nic.ArcBars({
		fn_bottomValue: (d, i) => d.v1,
		fn_topValue: (d, i) => d.v1 + d.v2,
		fn_defined: d => !isNaN(d.v1) && !isNaN(d.v2),
		fn_fill: fn_fill,
		fn_strokeWidth: () => 0,
		phi: 0.2
	})

	const arcChart = new d3nic.ArcChart(".svg1", {
		size: { width: 400, height: 500 },
		padding: { top: 0, right: 0, bottom: 0, left: 0 },
		transitionObject: { duration: 1000 },
		radiusRangeProportions: [0.1, 0.8],
		angleRange: [ 1/2 * Math.PI, - Math.PI],
		radiusPadding: { inner: 0, outer: 0 },
		fn_key: (d, i) => d.key,
		valueDomain: [0, NaN],
		data: data,
		components: [
			arcBars,
			new d3nic.ArcMouseBisector({
				fn_onMouseoverAction: mouseoverBisector,
				fn_onMouseoutAction: mouseoutBisector,
			})
		],
	})

	const sectorBars = new d3nic.SectorBars({
		fn_topValue: (d, i) => d.v1,
		fn_defined: d => !isNaN(d.v1),
		fn_fill: fn_fill,
		fn_strokeWidth: () => 0,
		phi: 0.2
	})

	const sectorChart = new d3nic.SectorChart(".svg2", {
		size: { width: 400, height: 500 },
		padding: { top: 0, right: 0, bottom: 0, left: 0 },
		transitionObject: { duration: 1000 },
		radiusRangeProportions: [0.1, 0.8],
		angleRange: [  Math.PI * 2, 0],
		anglePadding: {inner: 0, outer: 0},
		fn_key: (d, i) => d.key,
		valueDomain: [0, NaN],
		data: data,
		components: [
			sectorBars,
			new d3nic.SectorLine({
				fn_value: (d, i) => d.v1,
				fn_defined: d => !isNaN(d.v1),
				//fn_fill: d3.schemeReds[9][4],
				//fn_fillOpacity: 0.5,
				fn_stroke: () => "black",
				fn_strokeWidth: () => 2,
			}),
			new d3nic.SectorMouseBisector({
				fn_onMouseoverAction: mouseoverBisector,
				fn_onMouseoutAction: mouseoutBisector
			})
		],
	})





	const drawUpdate = () => {

    arcChart.draw()
    sectorChart.draw()

  }

  const fn_update = (t) => {
    random1 = d3.randomInt(0, data.length/2)()
    random2 = d3.randomInt(data.length/2, data.length)()
		const newData = data.filter(d => d.key >= random1 && d.key <= random2)
		arcChart.data = newData;
		sectorChart.data = newData;

		drawUpdate(t);
  }
  
  d3.select('#update').on("click", fn_update)

	drawUpdate()


})()