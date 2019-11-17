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
		{ key: 8, v1: 9, v2: 2 },
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
	];

	const fn_fill = d => d3.interpolateViridis(data.length ? 1-d.key/data.length : 0)
	

	d3.select(".container").call(container => {
		container.append("svg").classed("svg1", true)
		container.append("svg").classed("svg2", true)
		container.append("svg").classed("svg3", true)
		container.append("svg").classed("svg4", true)
		container.append("canvas").classed("canvas4", true).style("pointer-events", "none")
		container.append("svg").classed("svg5", true)
		container.append("svg").classed("svg6", true)
	})

	const mouseoverXyBisector = (d, i) => {
		xyMouseLines.join.style("opacity", f => d===f ? 1 : null)
		//xySymbols.join.style("r", f => f === d ? 8 : null)
		arcBars.join.style("opacity", f => d!==f ? 0.5 : null)
		sectorBars.join.style("opacity", f => d!==f ? 0.5 : null)
	}

	const mouseoutXyBisector = (d, i) => {
		xyMouseLines.join.style("opacity", null)
		//xySymbols.join.style("r", null)
		arcBars.join.style("opacity", null)
		sectorBars.join.style("opacity", null)
		xyBars.join.style("opacity", null)
	}

	const xyMouseLines = new d3nic.XyMouseLines({
		fn_value: d => d.v1 + d.v2,
		fn_opacity: d => 0,
	})

	const xySymbols = new d3nic.XySymbols({
		fn_value: d => d.v1,
		fn_size: d => 70,
		fn_type: (d, i) => i%2 ? d3.symbolWye : d3.symbolSquare,
		fn_fill: d => "red"
	})

	const xyChart = new d3nic.XyChart(".svg1", {
		padding: { top: 50, right: 50, bottom: 50, left: 50 },
		//size: {width: 800, height: 400},
		transition: { duration: 5000 },
		fn_key: (d, i) => d.key,
		valueDomain: [0, NaN],
		data: data,
		components: [
			new d3nic.XyAxes({
				yAxisVisible: false
			}),
			new d3nic.XyMouseBisector({
				fn_onMouseoverAction: mouseoverXyBisector,
				fn_onMouseoutAction: mouseoutXyBisector,
			}),
			xyMouseLines,
			new d3nic.XyLine({
				fn_value: d => d.v1 + d.v2,
				fn_strokeWidth: 3
			}),
			new d3nic.XyArea({
				fn_topValue: d => d.v1,
				fn_fill: d3.schemeReds[9][4],
			}),
			new d3nic.XyLine({
				fn_value: d => d.v1,
				fn_stroke: d3.schemeReds[9][6],
				fn_strokeWidth: 3
			}),
			xySymbols,
		]
	})


	const arcBars = new d3nic.ArcBars({
		fn_bottomValue: (d, i) => d.v1,
		fn_topValue: (d, i) => d.v1 + d.v2,
		fn_fill: fn_fill,
		fn_strokeWidth: () => 0,
	})

	const arcChart = new d3nic.ArcChart(".svg2", {
		padding: { top: 0, right: 0, bottom: 0, left: 0 },
		transition: { duration: 1000 },
		radiusRangeProportions: [0.1, 0.8],
		angleRange: [ 1/2 * Math.PI, - Math.PI],
		arcPadding: {
			inner: 0, outer: 0
		},
		fn_key: (d, i) => d.key,
		valueDomain: [0, NaN],
		data: data,
		components: [
			arcBars
		],
	})

	const sectorBars = new d3nic.SectorBars({
		fn_topValue: (d, i) => d.v1,
		fn_fill: fn_fill,
		fn_strokeWidth: () => 0,
	})

	const sectorChart = new d3nic.SectorChart(".svg3", {
		padding: { top: 0, right: 0, bottom: 0, left: 0 },
		transition: { duration: 1000 },
		radiusRangeProportions: [0.1, 0.8],
		angleRange: [ 2*Math.PI, 0],
		sectorPadding: {inner: 0, outer: 0},
		fn_key: (d, i) => d.key,
		valueDomain: [0, NaN],
		data: data,
		components: [
			sectorBars,
			new d3nic.SectorLine({
				fn_value: (d, i) => d.v1,
				//fn_fill: d3.schemeReds[9][4],
				//fn_fillOpacity: 0.5,
				fn_stroke: () => "black",
				fn_strokeWidth: () => 2,
			})
		],
	})

		
	let map = await d3.json("https://raw.githubusercontent.com/eurostat/Nuts2json/master/2016/4258/20M/0.json")
	let features = topojson.feature(map, map.objects.nutsrg).features.filter(f => f.properties.id.startsWith("IT")) //&& f.properties.id.length > 3 )
	let tweetsReceived = await d3.json("/resources/tweets.json")

	let tweets = tweetsReceived
		.map(t => t.geometry.coordinates)
		.flat(1)
		.map(c => {
			return {
				type: 'Point',
				coordinates: c
			}
		})

	const geoRegions = new d3nic.GeoRegions({
		fn_defined: d => d.type === "Feature",
		fn_fill: (d) => 'lightgray',
		fn_value: d => d.geometry,
		fn_strokeWidth: d => 1, 
		fn_stroke: d => "black",
	})

	const geoSymbols = new d3nic.GeoSymbols({
		fn_defined: d => d.type === "Point",
		fn_value: d => d,
		fn_strokeWidth: d => 0,
		fn_stroke: d => "black",
		fn_size: d => 70,
		fn_type: (d, i) => i%2 ? d3.symbolWye : d3.symbolSquare,
		fn_fill: d => d3.interpolateViridis(Math.random()),
	})

	const geoChart = new d3nic.GeoChart("canvas", {
		size: {width: 400, height: 400},
		transition: { duration: 0 },
		data: features.concat(tweets.slice(0, 1000)),
		components: [
			geoRegions,
			geoSymbols
		],
	})

	const fn_update = (brushData, t) => {
		const newData = brushData.filter(bd => bd.brushed).map(bd => bd.d);
		xyChart.data = newData;
		arcChart.data = newData;
		sectorChart.data = newData;
		xyStatisticChart.data = newData;
		random = d3.randomInt(0, tweets.length-100)()
		geoChart.data = features.concat(tweets.slice(random, random+100)),
		drawUpdate(t);
		geoChart.draw()
	}

	const fn_onBrushAction = brushData => {
		xyBars.join.style("fill-opacity", (d, i) => !brushData[i].brushed ? 0.2 : null) // working on indexes, not so pretty
		//fn_update(brushData)
	}	
	
	const fn_onEndAction = brushData => {
		fn_update(brushData, {duration: 1000});
	}


	const xyBars = new d3nic.XyBars({
		// fn_bottomValue: d => d.v1,
		fn_topValue: d => d.v1+d.v2,
		fn_strokeWidth: d => 0,
		fn_fill: fn_fill,
	})

	const xyMouseBrusher = new d3nic.XyMouseBrusher({
		fn_onBrushAction: fn_onBrushAction,
		fn_onEndAction: fn_onEndAction
	})

	const xyBrushChart = new d3nic.XyChart(".svg5", {
		padding: { top: 50, right: 50, bottom: 50, left: 50 },
		transition: { duration: 1000 },
		xPadding: { inner: 0, outside: 0},
		size: { width: 700 },
		fn_key: d => d.key,
		valueDomain: [0, NaN],
		data: data,
		components: [
			new d3nic.XyAxes(), xyBars, xyMouseBrusher
		]
	})

	const xyStatisticChart = new d3nic.XyChart(".svg6", {
		padding: { top: 50, right: 50, bottom: 50, left: 50 },
		transition: { duration: 1000 },
		xPadding: { outer: 0.5},
		size: { width: 400 },
		fn_key: d => d.key,
		valueDomain: [0, NaN],
		data: data,
		components: [
			new d3nic.XyAxes(),
			new d3nic.XyBoxPlots({
				fn_minValue: d => d.v1 - 2,
				fn_q1Value: d => d.v1 - 1,
				fn_medianValue: d => d.v1,
				fn_q3Value: d => d.v1 + 1,
				fn_maxValue: d => d.v1 + 2,
				fn_minWidth: d => 10,
				fn_maxWidth: d => 20,
				fn_fill: fn_fill,
				fn_fillOpacity: d => 0.5,
				fn_stroke: fn_fill,
				fn_strokeWidth: d => 2,
			}),
			new d3nic.XyLine({
				fn_value: d => d.v1
			}),
		]
	})

	const drawUpdate = () => {

		xyChart.draw()
		arcChart.draw();
		sectorChart.draw();
	  xyStatisticChart.draw()

	}

	xyBrushChart.draw()
	geoChart.draw()//{duration: 0, delay: 1000});

	drawUpdate()

/*



	setTimeout(() => {
		components.splice(2, 2);
		components.push(
			new XyArea({
				fn_value: d => d.v2,
				fn_fill: d3.schemeBlues[9][6],
				fn_fillOpacity: 0.3,
			})
		);

		xyChart.setComponents(components).draw({ name: "components", duration: 1000 });
	}, 4000);

	*/
})()