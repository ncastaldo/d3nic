d3.select(".container").call(container => {
  container.append("svg").classed("svg1", true)
  container.append("svg").classed("svg2", true)
})

const comp = d3nic
  .bxBars()
  .fnLowValue(d => 0)
  .fnHighValue(d => d)

const beta = d3nic.bxChart()

beta.fnBandValue((d, i) => i)
  .size({height: 500})

console.log(beta)

beta
  .data([0, 60, 123])
  .components([comp])
  .draw({duration: 1000})

const comp2 = d3nic
  .byBars()
  .fnLowValue(d => 0)
  .fnHighValue(d => d)

const gamma = d3nic.byChart()
  .selector('.svg2')
  .fnBandValue((d, i) => i)
  .size({height: 500})
  .data([0, 60, 123, 124, 323])
  .components([comp2])
  .draw({duration: 1000})

const update = () => {
  const d = [...Array(Math.round(Math.random()*10) + 1)].map(() => Math.random())
  gamma.data(d).draw({duration: 1000})
  beta.data(d).draw({duration: 1000})
}

d3.select('#update').on("click", update)

console.log(beta)
