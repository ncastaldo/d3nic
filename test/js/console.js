console.log('a')
const a = d3nic.bxBars()
console.log('b')

const b = d3nic.bxLine()

const arr = [a, b]

///console.log(arr)
//console.log([...arr])

console.log('c')
const c = d3nic.bxChart()
  .selector('svg')
  .data([1, 2, 3])

console.log('arr')
c.components([...arr])



console.log('draw')
c.draw()
