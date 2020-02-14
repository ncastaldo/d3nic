d3.select(".container").call(container => {
  container.append("svg").classed("svg1", true)
  container.append("svg").classed("svg2", true)
})

const beta = d3nic.bxChart()//.selector('.svg2')

const comp = d3nic
  .bxBars()
  .fnY0Value(d => 0)
  .fnY1Value(d => d)

beta.fnBxValue((d, i) => i)
  .size({height: 500})
  .data([0, 60, 123])
  .components([comp])
  .draw()
  .data([0, 2, 3])
  .draw({ duration: 3000, delay: 2000 })

console.log(beta)
