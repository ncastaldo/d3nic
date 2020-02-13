d3.select(".container").call(container => {
  container.append("svg").classed("svg1", true)
  container.append("svg").classed("svg2", true)
})

const beta = d3nic.chart()//.selector('.svg2')

const comp = d3nic.bxBars()

beta.size({height: 500})
  .data([0, 60])
  .components([comp])
  .draw()

console.log(beta.components())
