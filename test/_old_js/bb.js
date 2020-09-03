(async () => {

  let circumplexVA = await d3.json("/resources/circumplexVA.json")
  let circumplexVD = await d3.json("/resources/circumplexVD.json")
  let circumplexAD = await d3.json("/resources/circumplexAD.json")

  const baseDataVA = [...new Array(20 * 20).keys()].map((d, i) => ({v: Math.floor(i/20), a: i%20 }) )
  const baseDataVD = [...new Array(20 * 20).keys()].map((d, i) => ({v: Math.floor(i/20), d: i%20 }) )
  const baseDataAD = [...new Array(20 * 20).keys()].map((d, i) => ({a: Math.floor(i/20), d: i%20 }) )

  const dataVA = JSON.parse(JSON.stringify(baseDataVA))
  const dataVD = JSON.parse(JSON.stringify(baseDataVD))
  const dataAD = JSON.parse(JSON.stringify(baseDataAD))

  circumplexVA.forEach(c => dataVA.find(d => c.v === d.v && c.a === d.a).count = c.count)
  circumplexVD.forEach(c => dataVD.find(d => c.v === d.v && c.d === d.d).count = c.count)
  circumplexAD.forEach(c => dataAD.find(d => c.a === d.a && c.d === d.d).count = c.count)

  const fillScaleVA = d3.scaleSequentialLog(d3.interpolatePurples).domain(d3.extent(dataVA, d => d.count ? d.count : NaN))
  const fillScaleVD = d3.scaleSequentialLog(d3.interpolateReds).domain(d3.extent(dataVD, d => d.count ? d.count : NaN))
  const fillScaleAD = d3.scaleSequentialLog(d3.interpolateBlues).domain(d3.extent(dataVD, d => d.count ? d.count : NaN))
  
  const fillScaleDensity = d3.scaleSequentialLog(d3.interpolatePurples)
  const fillScaleDensityVD = d3.scaleSequentialLog(d3.interpolateReds)

	d3.select(".container").call(container => {
    container.append("svg").classed("svg1", true)
    container.append("svg").classed("svg3", true)
    container.append('div').append("svg").classed("svg2", true)
  })


  const fn_mouseoverVA = d => {
    bbRectsVA.join.style('opacity', f => f.v !== d.v && f.a !== d.a ? 0.1 : f.v !== d.v || f.a !== d.a ? 0.3 :null)
    bbRectsVA.join.style('stroke-width', f => f.v === d.v && f.a === d.a ? 1 : null)

    bbRectsVD.join.style('opacity', f => f.v !== d.v ? 0.1 : null)
    bbRectsVD.join.style('stroke-width', f => f.v === d.v ? 1 : null)

    bbRectsAD.join.style('opacity', f => f.a !== d.a ? 0.1 : null)
    bbRectsAD.join.style('stroke-width', f => f.a === d.a ? 1 : null)
  }

  const fn_mouseoutVA = d => {
    bbRectsVA.join.style('opacity', null)
    bbRectsVA.join.style('stroke-width', null)

    bbRectsVD.join.style('opacity', null)
    bbRectsVD.join.style('stroke-width', null)
    
    bbRectsAD.join.style('opacity', null)
    bbRectsAD.join.style('stroke-width', null)
  }



  const bbRectsVA = new d3nic.BbRects({
    fn_strokeWidth: () => 0,
    fn_stroke: () => '#555',
    fn_fill: d => d.count ? fillScaleVA(d.count) : '#fff',
    fn_enter: enter => enter
      .on('mouseover', fn_mouseoverVA)
      .on('mouseout', fn_mouseoutVA)
  })

  const bbContours = new d3nic.BbContours({
    fn_fill: d => fillScaleDensity(d.value),
    fn_strokeWidth: () => 0,
    fn_weight: d => d.count ? Math.log10(d.count) : 0,
    fn_enter: enter => enter.on('mouseenter', () => bbContours.join.style('opacity', 0.01))
      .on('mouseleave', () => bbContours.join.style('opacity', null))
  })
  
  const bbChartVA = new d3nic.BbChart(".svg1", {
    fn_key: d => [d.v, d.a],
    bxPadding: { inner: 0, outer: 0 },
    byPadding: { inner: 0, outer: 0 },
    size: { width: 300, height: 300 },
    data: dataVA,
    components: [ bbRectsVA, /*bbContours*/, new d3nic.BxAxis(), new d3nic.ByAxis(),  ]
  })

  const bbRectsVD = new d3nic.BbRects({
    fn_strokeWidth: () => 0,
    fn_stroke: () => '#555',
    fn_fill: d => d.count ? fillScaleVD(d.count) : '#fff'
  })

  const bbContoursVD = new d3nic.BbContours({
    fn_fill: d => fillScaleDensityVD(d.value),
    fn_strokeWidth: () => 0,
    fn_weight: d => d.count ? Math.log10(d.count) : 0,
    fn_enter: enter => enter.on('mouseenter', () => bbContoursVD.join.style('opacity', 0.01))
      .on('mouseleave', () => bbContoursVD.join.style('opacity', null))
  })

  const bbChartVD = new d3nic.BbChart(".svg2", {
    fn_key: d => [d.v, d.d],
    bxPadding: { inner: 0, outer: 0 },
    byPadding: { inner: 0, outer: 0 },
    size: { width: 300, height: 300 },
    data: dataVD,
    components: [ bbRectsVD, /*bbContoursVD*/ ]
  })

  const bbRectsAD = new d3nic.BbRects({
    fn_strokeWidth: () => 0,
    fn_stroke: () => '#555',
    fn_fill: d => d.count ? fillScaleAD(d.count) : '#fff'
  })

  const bbChartAD = new d3nic.BbChart(".svg3", {
    fn_key: d => [d.d, d.a],
    bxPadding: { inner: 0, outer: 0 },
    byPadding: { inner: 0, outer: 0 },
    size: { width: 300, height: 300 },
    data: dataAD,
    components: [ bbRectsAD ]
  })

  fillScaleDensity.domain(d3.extent(bbContours.componentData, d => d.value))
  fillScaleDensityVD.domain(d3.extent(bbContoursVD.componentData, d => d.value))

	const drawUpdate = (t) => {
    bbChartVA.draw(t)
    bbChartVD.draw(t)
    bbChartAD.draw(t)
  }

  const fn_update = () => {
    const dataVA2 = JSON.parse(JSON.stringify(baseDataVA))
    const dataVD2 = JSON.parse(JSON.stringify(baseDataVD))
    const dataAD2 = JSON.parse(JSON.stringify(baseDataAD))
    circumplexVA.forEach((c, i) => { i%d3.randomInt(1, 4)() > 0 ?  dataVA2.find(d => c.v === d.v && c.a === d.a).count = c.count : {}})
    circumplexVD.forEach((c, i) => { i%d3.randomInt(1, 4)() > 0 ?  dataVD2.find(d => c.v === d.v && c.d === d.d).count = c.count : {}})
    circumplexAD.forEach((c, i) => { i%d3.randomInt(1, 4)() > 0 ?  dataAD2.find(d => c.a === d.a && c.d === d.d).count = c.count : {}})
    bbChartVA.data = dataVA2
    bbChartVD.data = dataVD2
    bbChartAD.data = dataAD2
    fillScaleVA.domain(d3.extent(dataVA2, d => d.count ? d.count : NaN))
    fillScaleVD.domain(d3.extent(dataVD2, d => d.count ? d.count : NaN))
    fillScaleAD.domain(d3.extent(dataAD2, d => d.count ? d.count : NaN))

    fillScaleDensity.domain(d3.extent(bbContours.componentData, d => d.value))
    fillScaleDensityVD.domain(d3.extent(bbContoursVD.componentData, d => d.value))
    drawUpdate({ duration: 1000 });
  }
  
  d3.select('#update').on("click", fn_update)

	drawUpdate({ duration: 1000 })


})()