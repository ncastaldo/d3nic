(async () => {

	let circumplex = await d3.json("/resources/circumplexVA.json")

  const baseData = [...new Array(20 * 20).keys()].map((d, i) => ({v: Math.floor(i/20), a: i%20 }) )
  const data = JSON.parse(JSON.stringify(baseData))
  circumplex.forEach(c => data.find(d => c.v === d.v && c.a === d.a).count = c.count)

  const fillScale = d3.scaleSequentialLog(d3.interpolatePurples).domain(d3.extent(data, d => d.count ? d.count : NaN))
  const fillScaleDensity = d3.scaleSequentialLog(d3.interpolatePurples)

	d3.select(".container").call(container => {
		container.append("svg").classed("svg1", true)
  })

  const bbRects = new d3nic.BbRects({
    fn_strokeWidth: () => 0,
    fn_stroke: () => '#555',
    fn_fill: d => d.count ? fillScale(d.count) : '#fff'
  })

  const bbContours = new d3nic.BbContours({
    fn_fill: d => fillScaleDensity(d.value),
    fn_strokeWidth: () => 0,
    fn_weight: d => d.count ? Math.log10(d.count) : 0,
    fn_enter: enter => enter.on('mouseenter', () => bbContours.join.style('opacity', 0.01))
    .on('mouseleave', () => bbContours.join.style('opacity', null))
  })
  
  const bbChart = new d3nic.BbChart(".svg1", {
    fn_key: d => [d.v, d.a],
    bxPadding: { inner: 0, outer: 0 },
    byPadding: { inner: 0, outer: 0 },
    size: { width: 500, height: 500 },
    data: data,
    components: [ bbRects, bbContours ]
  })

  fillScaleDensity.domain(d3.extent(bbContours.componentData, d => d.value))

	const drawUpdate = (t) => {
    bbChart.draw(t)
  }

  const fn_update = () => {
    const data2 = JSON.parse(JSON.stringify(baseData))
    circumplex.forEach((c, i) => { i%d3.randomInt(1, 4)() > 0 ?  data2.find(d => c.v === d.v && c.a === d.a).count = c.count : {}})
    bbChart.data = data2
    fillScale.domain(d3.extent(data2, d => d.count ? d.count : NaN))
    fillScaleDensity.domain(d3.extent(bbContours.componentData, d => d.value))
    drawUpdate({ duration: 1000 });
  }
  
  d3.select('#update').on("click", fn_update)

	drawUpdate({ duration: 1000 })


})()