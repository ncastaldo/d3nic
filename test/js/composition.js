d3.select(".container").call(container => {
  container.append("svg").classed("svg1", true)
  container.append("svg").classed("svg2", true)
})

const beta = d3nic.bxChart()//.selector('.svg2')

const comp = d3nic.bxBars()

beta.size({height: 500})
  .data([0, 60])
  .components([comp])
  .draw()
  .data([0,14])
  .draw({duration: 1000})
  .data([60,24])
  .draw({duration: 1000, delay: 1000})

console.log(beta.data())
