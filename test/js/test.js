(async () => {


	let data = [
		{ key: 0, v1: 4, v2: 9 },
		{ key: 1, v1: 5, v2: 5 },
		{ key: 2, v1: 3, v2: 4 },
		{ key: 3, v1: 7, v2: 8 },
		{ key: 4, v1: 2, v2: 1 },
		{ key: 5, v1: 2, v2: 2 },
		{ key: 6, v1: 6, v2: 8 },
		{ key: 7, v1: 7, v2: 3 },
		{ key: 8, v1: 9, v2: 2 },
	];


	const svg1 = d3.select(".container").append("svg")
	const svg2 = d3.select(".container").append("svg")
	const svg3 = d3.select(".container").append("svg")
	const svg4 = d3.select(".container").append("svg")

	const xyChart = new d3nic.XyChart(svg1, {
		padding: { top: 50, right: 50, bottom: 50, left: 50 },
		fn_key: (d, i) => d.key,
		valueDomain: [0, NaN],
		components: [
			new d3nic.XyAxes(),
			new d3nic.XyMouseBisector(),
			new d3nic.XyMouseLines({
				fn_value: d => d.v1 + d.v2
			}),
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
			new d3nic.XyCircles({
				fn_value: d => d.v1,
				fn_radius: 5,
				fn_fill: "red"
			})
		],
		data: data,
	})


	const arcChart = new d3nic.ArcChart(svg2, {
		padding: { top: 0, right: 0, bottom: 0, left: 0 },
		radiusRangeProportions: [0.1, 0.8],
		angleRange: [ 1/2 * Math.PI, - Math.PI],
		arcPadding: {
			inner: 0.5, outer: 0.5
		},
		fn_key: (d, i) => d.key,
		valueDomain: [0, NaN],
		components: [
			new d3nic.ArcBars({
				fn_value: (d, i) => d.v1,
				fn_fill: (d, i, nodes) => d3.interpolateViridis(1-i/nodes.length),
				fn_strokeWidth: () => 0,
			})
		],
		data: data
	})


	const sectorChart = new d3nic.SectorChart(svg3, {
		padding: { top: 0, right: 0, bottom: 0, left: 0 },
		radiusRangeProportions: [0.1, 0.8],
		angleRange: [ 2*Math.PI, 0],
		sectorPadding: {inner: 0, outer: 0},
		fn_key: (d, i) => d.key,
		valueDomain: [0, NaN],
		components: [
			new d3nic.SectorBars({
				fn_value: (d, i) => d.v1,
				fn_fill: (d, i, nodes) => d3.interpolateViridis(1-i/nodes.length),
				fn_strokeWidth: () => 0,
			}),
			new d3nic.SectorLine({
				fn_value: (d, i) => d.v1,
				//fn_fill: d3.schemeReds[9][4],
				//fn_fillOpacity: 0.5,
				fn_stroke: () => "white",
				fn_strokeWidth: () => 2,
			})
		],
		data: data,
	})

		
	let map = await d3.json("https://raw.githubusercontent.com/eurostat/Nuts2json/master/2016/4258/20M/0.json")
	let featureCollection = topojson.feature(map, map.objects.nutsrg)

	const geoChart = new d3nic.GeoChart(svg4, {
		projectionObject: featureCollection,
		data: featureCollection.features,
		fn_key: d => d.properties.NC_KEY,
		components: [
			new d3nic.GeoRegions({
				fn_fill: (d, i, nodes) => d3.interpolateViridis(Math.random()),
				fn_value: d => d
			}),
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
		data: featureCollection.features
	})



	const fn_randomNatural = (range) => Math.floor(( Math.random() * range[1] )) + range[0]

	svg1.on("click", () => {

		const start = data[data.length - 1].key

		const rem = fn_randomNatural([0, data.length]) - 1
		const add = fn_randomNatural([0, data.length])
		

		for(let i = 0; i<rem; i++)
			data.shift();

		for(let j = 0; j<add; j++)
			data.push({ key: start + j + 1, v1: fn_randomNatural([2, 12]), v2: fn_randomNatural([4, 8]) });


		xyChart.data = data
		arcChart.data = data
		sectorChart.data = data
		
		draw()
	})


	const draw = async () => {

		t = null//const t = d3.transition("data").duration(1000);
		xyChart.draw(t)
		arcChart.draw(t);
		sectorChart.draw(t);
		geoChart.draw(t);

		//t.end().then((res) => console.log(res))

	}


	draw()

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