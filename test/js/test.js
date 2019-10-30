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
	

	const svg1 = d3.select(".container").append("svg")
	const svg2 = d3.select(".container").append("svg")
	const svg3 = d3.select(".container").append("svg")
	const svg4 = d3.select(".container").append("svg")
	const svg5 = d3.select(".container").append("svg")

	const mouseoverXyBisector = (d, i) => {
		xyMouseLines.join.style("opacity", f => d===f ? 1 : null)
		xyCircles.join.style("r", f => f === d ? 8 : null)
		arcBars.join.style("opacity", f => d!==f ? 0.5 : null)
		sectorBars.join.style("opacity", f => d!==f ? 0.5 : null)
	}

	const mouseoutXyBisector = (d, i) => {
		xyMouseLines.join.style("opacity", null)
		xyCircles.join.style("r", null)
		arcBars.join.style("opacity", null)
		sectorBars.join.style("opacity", null)
		xyBars.join.style("opacity", null)
	}

	const xyMouseLines = new d3nic.XyMouseLines({
		fn_value: d => d.v1 + d.v2,
		fn_opacity: d => 0,
	})

	const xyCircles = new d3nic.XyCircles({
		fn_value: d => d.v1,
		fn_radius: 5,
		fn_fill: "red"
	})

	const xyChart = new d3nic.XyChart(svg1, {
		padding: { top: 50, right: 50, bottom: 50, left: 50 },
		//size: {width: 800, height: 400},
		fn_key: (d, i) => d.key,
		valueDomain: [0, NaN],
		data: data,
		components: [
			new d3nic.XyAxes(),
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
				fn_value: d => d.v1,
				fn_fill: d3.schemeReds[9][4],
			}),
			new d3nic.XyLine({
				fn_value: d => d.v1,
				fn_stroke: d3.schemeReds[9][6],
				fn_strokeWidth: 3
			}),
			xyCircles,
		]
	})


	const arcBars = new d3nic.ArcBars({
		fn_value: (d, i) => d.v1,
		fn_fill: fn_fill,
		fn_strokeWidth: () => 0,
	})

	const arcChart = new d3nic.ArcChart(svg2, {
		padding: { top: 0, right: 0, bottom: 0, left: 0 },
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
		fn_value: (d, i) => d.v1,
		fn_fill: fn_fill,
		fn_strokeWidth: () => 0,
	})

	const sectorChart = new d3nic.SectorChart(svg3, {
		padding: { top: 0, right: 0, bottom: 0, left: 0 },
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

		
	let map = await d3.json("https://raw.githubusercontent.com/eurostat/Nuts2json/master/2016/4258/20M/3.json")
	let features = topojson.feature(map, map.objects.nutsrg).features.filter(f => f.properties.id.startsWith("IT") && f.properties.id.length > 3 )

	let featureCollection = { type: "FeatureCollection", features: features }

	console.log(features)


	const clickGeoRegions = (d, i, nodes) => {

		const zoomed = d3.selectAll(nodes)
			.filter(f => f === d)
			.classed("zoomed")

		geoChart.projectionObject = zoomed ? 
			{ type: "FeatureCollection", features: d3.selectAll(nodes).data() } : d

		d3.selectAll(nodes)
			.classed("outside", !zoomed)
			.classed("zoomed", false)
			.filter(f => f === d)
			.classed("outside", false)
			.classed("zoomed", !zoomed)

		const t = d3.transition().duration(1000)
		geoChart.draw(t)
	}

	const mouseoverGeoRegions = (d, i, nodes) => {
		geoRegions.join.style("fill-opacity", 
			f => f === d && !d3.select(nodes[i]).classed("outside") ? 0.7 : null)
	}

	const mouseoutGeoRegions = (d, i, nodes) => {
		geoRegions.join.style("fill-opacity",null)
	}

	const geoRegions = new d3nic.GeoRegions({
			fn_fill: (d, i, nodes) => d3.interpolateViridis(nodes.length > 0 ? i/nodes.length : 0.5),
			fn_value: d => d,
			fn_opacity: (d, i, nodes) => d3.select(nodes[i]).classed("outside") ? 0 : 1,
			fn_enter: enter => enter
				.on("mouseover", mouseoverGeoRegions)
				.on("mouseout", mouseoutGeoRegions)
				.on("click", clickGeoRegions),
		})

	const geoChart = new d3nic.GeoChart(svg4, {
		projectionObject: featureCollection,
		data: featureCollection.features,
		size: {width: 500, height: 400},
		fn_key: d => d.properties.id,
		data: featureCollection.features,
		components: [
			geoRegions,
			/*new GeoTooltips({
				fn_enter: (enter, options) => enter.each((d, i, nodes) => {
					const xyChart = new XyChart(d3.select(nodes[i]),{
						padding: { top: 0, right: 0, bottom: 0, left: 0 },
						fn_key: (d, i) => d.key,
						valueDomain: [0, NaN],
						components: [
							new XyArea({
								fn_value: d => d.v1
							})
						],
						data: data,
					})
					xyChart.draw({ init: true, name: "data", duration: 1000 })
				})
			})*/
		],
	})

	const fn_onBrushAction = brushData => {
		xyBars.join.style("fill-opacity", (d, i) => !brushData[i].brushed ? 0.2 : null) // working on indexes, not so pretty	
		const newData = brushData.filter(bd => bd.brushed).map(bd => bd.d);
		xyChart.data = newData;
		arcChart.data = newData;
		sectorChart.data = newData;
		drawUpdate();
	}	
	
	const fn_onEndAction = brushData => {
		/*const newData = brushData.filter(bd => bd.brushed).map(bd => bd.d);
		xyChart.data = newData;
		arcChart.data = newData;
		sectorChart.data = newData;
		drawUpdate(d3.transition());*/
	}


	const xyBars = new d3nic.XyBars({
		fn_value: d => d.v1,
		fn_strokeWidth: d => 0,
		fn_fill: fn_fill,
	})

	const xyMouseBrusher = new d3nic.XyMouseBrusher({
		fn_onBrushAction: fn_onBrushAction,
		fn_onEndAction: fn_onEndAction
	})

	const xyBrushChart = new d3nic.XyChart(svg5, {
		padding: { top: 50, right: 50, bottom: 50, left: 50 },
		xPadding: { inner: 0, outside: 0},
		size: { width: 700 },
		fn_key: d => d.key,
		valueDomain: [0, NaN],
		data: data,
		components: [
			new d3nic.XyAxes(), xyBars, xyMouseBrusher
		]
	})

	const drawUpdate = (t=undefined) => {

		xyChart.draw(t)
		arcChart.draw(t);
		sectorChart.draw(t);
		geoChart.draw(t);

	}

	const t = d3.transition("data").duration(1000);
	xyBrushChart.draw(t)
	drawUpdate(t)

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