(async () => {

	d3.select(".container").call(container => {
		container.append("svg").classed("svg1", true)
		container.append("canvas").classed("canvas1", true).style("pointer-events", "none")
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
		})// .slice(0, 5000)

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

	const geoChart = new d3nic.GeoChart(".canvas1", {
		size: {width: 400, height: 400},
		transitionObject: { duration: 0, delay: 1000 },
		data: features.concat(tweets),//.slice(0, 1000)),
		components: [
			geoRegions,
			geoSymbols
		],
	})

	const geoFillScale = d3.scaleSequential(d3.interpolateBlues)

	const geoContours = new d3nic.GeoContours({
		fn_defined: d => d.type === "Point",
		fn_value: d => d,
		fn_strokeWidth: d => 0,
		fn_stroke: d => "black",
		fn_fill: d => geoFillScale(d.value)
	})

	const geoChart2 = new d3nic.GeoChart(".svg1", {
		size: {width: 400, height: 400},
		transitionObject: {duration: 2000},
		//data: features.concat(tweets.slice(0, 2000)),
		data: tweets.concat(features),
		components: [
			geoContours,
			new d3nic.GeoRegions({
				fn_defined: d => d.type === "Feature",
				fn_value: d => d.geometry,
				fn_fill: '#ddd',
				fn_fillOpacity: d => 0
			})
		],
	})

	geoFillScale.domain(d3.extent(geoContours.componentData, d => d.value))
  

	const drawUpdate = () => {

    geoChart2.draw()
    geoChart.draw()//{duration: 0, delay: 1000});

  }

  const fn_update = (t) => {
		random = d3.randomInt(0, tweets.length-50)()
		geoChart.data = features.concat(tweets.slice(random, random+100)),
		geoChart2.data = tweets.slice(random, random+50).concat(features)

		geoFillScale.domain(d3.extent(geoContours.componentData, d => d.value))

		const random2 = d3.randomInt(400, 600)
		const newSize = {width: random2(), height: random2() }
		geoChart.size = newSize,
		geoChart2.size = newSize;

		drawUpdate(t);
  }
  
  d3.select('#update').on("click", fn_update)

	drawUpdate()

})()