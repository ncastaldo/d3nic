d3.select(".container").call(container => {
  container.append("svg").classed("svg0", true)
  container.append("svg").classed("svgPolar", true)
  container.append("svg").classed("svg1", true)
  container.append("svg").classed("svg2", true)
  container.append("svg").classed("svg3", true)
  container.append("svg").classed("svg4", true)
  container.append("svg").classed("svg5", true)
  container.append("svg").classed("svg6", true)
})

const data = [...Array(Math.round(Math.random()*70) + 1)].map(() => Math.random())
const fnColor = d3.scaleSequential(d3.interpolateViridis)
  .domain([0, data.length - 1])
const fnFill = (d, i) => fnColor(i)

const chart = d3nic.bxChart()
  .selector('svg')
  .size({width: 500, height: 400})
  .data(data)
  .components([
    d3nic.bxAxisX(), // new entry
    d3nic.labelAxisX().fnFontSize(d => 16).fnText(d => 'mandi').textPadding({top: 30}),
    d3nic.labelAxisY().fnFontSize(d => 16).fnText(d => 'mandi').textPadding({right: 30}),
    d3nic.bxAxisY(), // new entry
    d3nic.bxBars().fnFill(fnFill),
    d3nic.bxBrush().fnOn('endBandDomain', (event, bd) => {
      const dd = bd ? data.filter((_, j) => j >= bd[0] && j<=bd[1]) : data
      bandCharts.map(chart => chart.data(dd).draw({duration: 1000}))
      eChart.data(dd.map(v => [v, Math.round(Math.random()*70) + 1])).draw({duration: 2000})
      fChart.data(dd.map(v => [v, Math.round(Math.random()*5) + 1])).draw({duration: 2000})
    }),
  ])
  .draw({duration: 500})

const circles = d3nic.bxCircles().fnStrokeWidth(2)

const onMouseover = (event, d, i) => {
  console.log(i)
  circles.join().filter(f => f === d).style('r', 10)
}
const onMouseout = (event, d, i) => {
  circles.join().style('r', null)
}


const polarChart = d3nic.baChart()
  .selector('.svgPolar')
  .radiusExtent([0.1, 1])
  .size({width: 500, height: 400})
  .data([1, 10, 30, 2, 42])
  .contScaleType('scaleLinear')
  .bandPaddingInner(0.3)
  .bandPaddingOuter(0.15)
  .components([
    d3nic.baBars().fnFill(fnFill),
    d3nic.baCircles().fnFill(fnFill),
    d3nic.baLine().fnFillOpacity(0).fnStrokeWidth(2).fnStrokeDasharray([2, 2]),
    d3nic.baAxisA().tickSizeOuter(0),
    d3nic.baCircle()
      .fnValue(d => 0.5)
      .fnStrokeWidth(() => 2)
      .fnStroke(() => '#444')
      .fnFillOpacity(() => 0)
      .fnStrokeDasharray([2, 10]),
    d3nic.baMouseBars()
      .fnOn('mouseover', onMouseover)
      .fnOn('mouseout', onMouseout)
  ])
  // .draw({duration: 500})


const aChart = d3nic.bxChart()
  .selector('.svg1')
  .data([0, 10, 20])
  .components([
    d3nic.bxAxisX(),
    d3nic.bxAxisY(),
    d3nic.bxLine().fnDefined((d, i) => i % 5 !== 3).fnFillOpacity(0).fnStrokeWidth(2),
    d3nic.bxLines().fnLowValue(d => d - 0.3).fnStrokeWidth(2),
    circles,
    d3nic.bxMouseBars()
      .fnOn('mouseover', onMouseover)
      .fnOn('mouseout', onMouseout)
  ])

const bChart = d3nic.bxChart()
  .selector('.svg2')
  .size({width: 500, height: 400})
  .data([0, 0.5, 1])
  .components([
    d3nic.bxAxisX(),
    d3nic.bxAxisY(),
    d3nic.bxArea().fnDefined((d, i) => i % 5 !== 3).fnLowValue(d => d - 0.3),
    d3nic.bxLines().fnDefined((d, i) => i % 5 !== 2).fnLowValue(d => d - 0.3).fnStrokeWidth(2),
  ])

const cChart = d3nic.byChart()
  .selector('.svg3')
  .size({width: 500, height: 500})
  .data([0, 0.5, 1])
  .components([
    d3nic.byBars().fnFill(fnFill)
  ])


const dChart = d3nic.geoChart()
  .selector('.svg4')
  .geoProjectionType('geoMercator')
  .fnKey(d => d.properties.id)
  .size({width: 600, height: 500})
  .components([
    d3nic.geoRegions().fnValue(d => d.geometry)
  ])

const eChart = d3nic.xyChart()
  .selector('.svg5')
  .size({width: 600, height: 500})
  .data([[0, 3], [0.5, 4], [1, 6], [3, 4], [2, 2]])
  .components([
    d3nic.xyAxisX(),
    d3nic.xyAxisY(),
    d3nic.xyCircles().fnFill('blue'),
    d3nic.xyLinesH().fnStrokeWidth(1).fnStrokeDasharray([2, 2]),
    d3nic.xyLinesV().fnStrokeWidth(1).fnStrokeDasharray([2, 2])
  ])

eChart.draw({duration:1000})


const fChart = d3nic.bbChart()
.selector('.svg6')
  .size({width: 600, height: 500})
  .data([[0, 0], [0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 0]])
  .fnDoubleBandValue((d, i) =>[d[0], d[1]])
  .components([
    d3nic.bbRects()
  ])

fChart.draw({duration:1000})


let feature
{(async () => {
  const map = await d3.json("https://raw.githubusercontent.com/eurostat/Nuts2json/master/2016/4258/20M/0.json")
  features = topojson.feature(map, map.objects.nutsrg).features //&& f.properties.id.length > 3 )
  dChart.data(features).draw()
})()}


bandCharts = [aChart, bChart, cChart, polarChart]
bandCharts.map(chart => chart.draw({duration: 1000}))


const update = () => {
  chart.data(data)
  bandCharts.map(c => c.size({width: c.size().height, height: c.size().width}))
  bandCharts.map(chart => chart.draw({duration: 1000}))

  const geoData = dChart.data()
  // geoData.length > 1 ? dChart.data([geoData[Math.floor(Math.random() * geoData.length)]]) : dChart.data(features)
  // dChart.draw({duration: 1000})
}

d3.select('#update').on("click", update)

