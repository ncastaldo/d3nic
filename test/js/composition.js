d3.select(".container").call(container => {
  container.append("svg").classed("svg1", true)
  container.append("svg").classed("svg2", true)
})

const alfa = d3nic.xyChart().selector('.svg1')
const beta = d3nic.chart().selector('.svg2')

beta.data(['hello', 'there'])

console.log(alfa.height(100).draw())
console.log(beta.draw())
