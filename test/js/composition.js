d3.select(".container").call(container => {
  container.append("svg").classed("svg1", true)
  container.append("svg").classed("svg2", true)
})

const beta = d3nic.bxChart()//.selector('.svg2')

const comp = d3nic
  .bxBars()
  .fnBottomValue(d => d-1)
  .fnTopValue(d => d)

beta.fnBxValue((d, i) => i)
  .size({height: 500})
  .data([0, 60, 123])
  .components([comp])
  .draw()

const update = () => {
  beta.data([Math.random() + Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random()])
  .draw({duration: 200})
}

d3.select('#update').on("click", update)

console.log(beta)
