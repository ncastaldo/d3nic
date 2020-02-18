d3.select(".container").call(container => {
  container.append("svg").classed("svg1", true)
  container.append("svg").classed("svg2", true)
})

const beta = d3nic.bxChart()//.selector('.svg2')

const comp = d3nic
  .bxBars()
  .fnBottomValue(d => 0)
  .fnTopValue(d => d)

beta.fnBxValue((d, i) => i)
  .size({height: 500})
  .data([0, 60, 123])
  .components([comp])
  .draw()

const comp2 = d3nic
  .bandBars()
  .fnBottomValue(d => 0)
  .fnTopValue(d => d)

const gamma = d3nic.bandChart()
  .selector('.svg2')
  .fnBandValue((d, i) => i)
  .size({height: 500})
  .data([0, 60, 123, 124, 323])
  .components([comp2])
  .draw()

const update = () => {
  const d = [Math.random() + Math.random(), Math.random(),  Math.random()]
  gamma.data(d).draw({duration: 1000})
  beta.data(d).draw({duration: 1000})
}

d3.select('#update').on("click", update)

console.log(beta)
