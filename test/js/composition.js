d3.select(".container").call(container => {
  container.append("svg").classed("svg1", true)
  container.append("svg").classed("svg2", true)
  container.append("svg").classed("svg3", true)
  container.append("svg").classed("svg4", true)
})


const circles = d3nic.bxCircles().fnStrokeWidth(2)

const onMouseover = (d, i) => {
  circles.join().filter(f => f === d).style('r', 10)
}
const onMouseout = (d, i) => {
  circles.join().style('r', null)
}

const aChart = d3nic.bxChart()
  .selector('.svg1')
  .data([0, 0.5, 1])
  .components([
    d3nic.bxAxisX(),
    d3nic.bxAxisY(),
    d3nic.bxArea().fnLowValue(d => d - 0.3),
    d3nic.bxLines().fnLowValue(d => d - 0.3).fnStrokeWidth(2),
    circles,
    d3nic.bxMouseBars()
      .fnOn('mouseover', onMouseover)
      .fnOn('mouseout', onMouseout)
  ])

const bChart = d3nic.bxChart()
  .selector('.svg2')

  .size({height: 500, height: 400})
  .data([0, 0.5, 1])
  .components([
    d3nic.bxAxisX(),
    d3nic.bxAxisY(),
    d3nic.bxArea().fnLowValue(d => d - 0.3),
    d3nic.bxLines().fnLowValue(d => d - 0.3).fnStrokeWidth(2),
  ])

const cChart = d3nic.byChart()
  .selector('.svg3')
  .size({height: 500, height: 500})
  .data([0, 0.5, 1])
  .components([
    d3nic.byBars()
  ])


const dChart = d3nic.geoChart()
  .selector('.svg4')
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



bandCharts = [aChart, bChart, cChart]
bandCharts.map(chart => chart.draw({duration: 1000}))


const update = () => {
  const data = [...Array(Math.round(Math.random()*10) + 1)].map(() => Math.random())
  bandCharts.map(chart => chart.data(data))
  bandCharts.map(c => c.size({width: c.size().height, height: c.size().width}))
  bandCharts.map(chart => chart.draw({duration: 1000}))

  const geoData = dChart.data()
  geoData.length > 1 ? dChart.data([geoData[Math.floor(Math.random() * geoData.length)]]) : dChart.data(features)
  dChart.draw({duration: 1000})
}

d3.select('#update').on("click", update)

