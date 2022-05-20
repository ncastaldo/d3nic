# d3nic

[![license](https://img.shields.io/github/license/ncastaldo/d3nic)](LICENSE-MIT)

## What is this?

d3nic is a D3.js based library that exposes methods to easily create interactive and dynamic charts.

**[DEMO at https://ncastaldo.github.io/d3nic](https://ncastaldo.github.io/d3nic)**

It is based on the concepts of _chart_ and _component_.

- A _chart_ is an object that may contain multiple components and is responsible of computing all the common variables that these element have.
- A _component_ is the actual object that we want to visualize.

## How to use it

If you use npm, `npm i d3nic`.

For legacy environments, you can load d3nic's UMD bundle from an npm-based CDN such as jsDelivr; a d3nic global is exported:

```js
<script src="https://cdn.jsdelivr.net/npm/d3nic/dist/index.js"></script>
```

## An example

Let us define a simple bar chart:

```js
document.createElement("svg"); // or d3.append('svg')

const chart = d3nic
  .bxChart()
  .selector("svg")
  .size({ width: 500, height: 400 })
  .data([2, 5, 8, 3, 6])
  .components([d3nic.bxBars()]);

chart.draw();
```

Now, if we call calling `chart.draw()` the chart will be plotted.

What if we want to use axes and have a nice transition when creating the chart? We just have to create the object this way:

```js
const chart = d3nic
  .bxChart()
  .selector("svg")
  .size({ width: 500, height: 400 })
  .data([2, 5, 8, 3, 6])
  .components([d3nic.bxAxisX(), d3nic.bxAxisY(), d3nic.bxBars()])
  .draw({ duration: 500 });
```

A ready to use chart will be plotted, with a nice transition too.

In order to update the data, we can simply type:

```js
chart.data([12, -5, 34, 22]).draw({ duration: 1000, delay: 1000 });
```

## Available charts and components

_Notes_

- The _b_ placeholder stands for _band_, which indicates the usage of a (D3) bandScale to place the different data elements.
- The presence of a char from <_x_, _y_> or <_r_ (_radius_), _a_ (_angle_)>, placed next to a _b_ char, express what dimension will be used for the bandScale, e.g. _bxChart_ -> apply the band on the _x_ axis, the _y_ axis will be used for the actual values.

#### Basic

The components can be used in combination to every chart

- chart
  - circles
  - labelAxisX
  - labelAxisY
  - paths
  - texts

#### Composite

The components have to be used in combination to the related chart

- bbChart

  - bbCircles
  - bbRects

- brChart

  - brBars
  - brMouseBars
  - brStackBars

- bxChart

  - bxArea
  - bxAxisX
  - bxAxisY
  - bxBars
  - bxBrush
  - bxCircles
  - bxLine
  - bxLines
  - bxMouseBars

- byChart

  - byAxisX
  - byAxisY
  - byBars
  - byLines
  - byMouseBars

- geoChart

  - geoRegions

- xyChart
  - xyAxisX
  - xyAxisY
  - xyCircles
  - xyLinesH
  - xyLinesV
  - xyTexts
