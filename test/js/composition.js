d3.select(".container").call(container => {
  container.append("svg").classed("svg1", true)
  container.append("svg").classed("svg2", true)
})

let alfa = d3nic.xyChart().selector('.svg1').draw()

console.log(alfa)
