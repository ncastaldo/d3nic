console.log('hello')

const a = d3nic.bxBars()

const b = d3nic.bxLine()

const arr = [a, b]

console.log(arr)
console.log([...arr])

const c = d3nic.bxChart()
  .selector('svg')
  .data([1, 2, 3])

c.components([...arr])

console.log(c)

c.draw()
