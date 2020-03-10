# d3nic

## What is this?

d3nic is a D3.js based library that exposes methods to easily create interactive and dynamic charts.

It is based on the concepts of *chart* and *component*.

A *chart* is an object that may contain multiple components and is responsible of computing all the common variables that these element have.

A *component* is the actual object that we want to visualize.

## How to use it

d3nic can be used in a browser by using `<script src="https://cdn.jsdelivr.net/npm/d3nic/dist/index.js"></script>` or with npm, by simply typing `npm i d3nic`

## An example

Let us define a simple bar chart:

```
document.createElement("svg"); // or d3.append('svg')

const chart = d3nic.bxChart()
  .selector('svg')
  .size({width: 500, height: 400})
  .data([2, 5, 8, 3, 6])
  .components([
    d3nic.bxBars()
  ])

chart.draw()
```

Now, by simply calling `chart.draw()` the chart will be plotted.

What if we want to use axes and have a nice transition when creating the chart? We just have to create the object this way:

```
const chart = d3nic.bxChart()
  .selector('svg')
  .size({width: 500, height: 400})
  .data([2, 5, 8, 3, 6])
  .components([
    d3nic.bxAxisX(), // new entry
    d3nic.bxAxisY(), // new entry
    d3nic.bxBars()
  ])
  .draw({duration: 500})
```

A ready to use chart will be plotted, with a nice transition too.

In order to update the data, we can simply type:

```
chart.data([12, -5, 34, 22])
  .draw({duration: 1000, delay: 1000})
```

## Test it

Open this [jsfiddle](https://jsfiddle.net/1jLtyxbs/3/) to see how it works!

