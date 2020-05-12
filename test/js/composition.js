d3.select(".container").call(container => {
  container.append("svg").classed("svg0", true)
  container.append("svg").classed("svgPolar", true)
  container.append("svg").classed("svg1", true)
  container.append("svg").classed("svg2", true)
  container.append("svg").classed("svg3", true)
  container.append("svg").classed("svg4", true)
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
    d3nic.bxAxisY(), // new entry
    d3nic.bxBars().fnFill(fnFill),
    d3nic.bxBrush().fnOn('endDomain', (bd) => {
        const dd = bd ? data.filter((_, j) => j >= bd[0] && j<=bd[1]) : []
        bandCharts.map(chart => chart.data(dd).draw({duration: 1000}))
    }),
  ])
  .draw({duration: 500})

const circles = d3nic.bxCircles().fnStrokeWidth(2)

const onMouseover = (d, i) => {
  circles.join().filter(f => f === d).style('r', 10)
}
const onMouseout = (d, i) => {
  circles.join().style('r', null)
}


const polarChart = d3nic.baChart()
  .selector('.svgPolar')
  .radiusExtent([0.1, 1])
  .size({width: 500, height: 400})
  .data([1, 10, 30, 2, 42])
  .contScaleType('scaleLinear')
  .paddingInner(0.3)
  .paddingOuter(0.15)
  .components([
    d3nic.baBars().fnFill(fnFill),
    d3nic.baLine().fnFillOpacity(0).fnStrokeWidth(2).fnStrokeDasharray([2, 2]),
    d3nic.baAxisA().tickSizeOuter(0),
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

