d3.select(".container").call(container => {
  container.append("svg").classed("svg1", true)
  container.append("svg").classed("svg2", true)
})

var alfa = d3nic.chart({selector: '.svg1'})
var beta = d3nic.xyChart({selector: '.svg2'})

alfa.draw()
alfa.height = 30

console.log(alfa)

beta.draw()
beta.width = 20

console.log(beta)