# d3nic

## What is this?

d3nic is a D3.js based library that exposes methods to easily create interactive and dynamic charts.

It is based on the concepts of *chart* and *component*.

A *chart* is an object that may contain multiple components and is responsible of computing all the common variables that these element have.

A *component* is the actual object that we want to visualize.

![Demo .gif](https://github.com/ncastaldo/d3nic/tree/master/img/demo.gif)

Here you can see two charts - brChart and baChart - with their corresponding components - brBars and brBars. Most of the configuration and the data are the same but the result is quite different!

## How to use it

d3nic can be used in a browser with the script tag `<script src="https://cdn.jsdelivr.net/npm/d3nic/dist/index.js"></script>` or installed with npm with `npm i d3nic`

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

Now, if we call calling `chart.draw()` the chart will be plotted.

What if we want to use axes and have a nice transition when creating the chart? We just have to create the object this way:

```
const chart = d3nic.bxChart()
  .selector('svg')
  .size({width: 500, height: 400})
  .data([2, 5, 8, 3, 6])
  .components([
    d3nic.bxAxisX(),
    d3nic.bxAxisY(),
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

## Available charts and components

*Notes*
- The *b* placeholder stands for *band*, which indicates the usage of a (D3) bandScale to place the different data elements.
- The presence of a char from <*x*, *y*> or <*r* (*radius*), *a* (*angle*)>, placed next to a *b* char, express what dimension will be used for the bandScale, e.g. *bxChart* -> apply the band on the *x* axis, the *y* axis will be used for the actual values.

#### Basic

The components can be used in combination to every chart

* chart
  * circles
  * labelAxisX
  * labelAxisY
  * paths
  * texts


#### Composite

The components have to be used in combination to the related chart

* bbChart
  * bbCircles
  * bbRects

* brChart
  * brBars
  * brMouseBars
  * brStackBars

* bxChart
  * bxArea
  * bxAxisX
  * bxAxisY
  * bxBars
  * bxBrush
  * bxCircles
  * bxLine
  * bxLines
  * bxMouseBars

* byChart
  * byAxisX
  * byAxisY
  * byBars
  * byLines
  * byMouseBars

* geoChart
  * geoRegions

* xyChart
  * xyAxisX
  * xyAxisY
  * xyCircles
  * xyLinesH
  * xyLinesV
  * xyTexts

## Test it

Open this [jsfiddle](https://jsfiddle.net/xdt4f2h0/) to see how it works!

