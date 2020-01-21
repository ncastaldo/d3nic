"use strict";

import { tooltip } from "./tooltip.js";
import { barBrusher } from "./barBrusher.js";

/*
 *
 *	Bar chart with vertical bars.
 *
 */
function barChart() {
	/*
	 *	MAIN variables default values.
	 */
	let width = 700,
		height = 200,
		padding = { top: 30, right: 30, bottom: 30, left: 30, inner: 0.1, outer: 0 },
		yMin,
		yMax,
		tooltip = (selection) => selection;

	/*
	 *	Variables related to the data default values.
	 */
	let fn_key = (d, i) => i,
		fn_color = (v, j, d, i) => d3.schemeCategory10[j],
		fn_areaOpacity = (v, j) => 1,
		values = ["value"];

	/*
	 *	Handler functions of mouse events.
	 */
	let fn_handleMouseOver = (d, i, nodes) =>
		d3.select(nodes[i]).style("opacity", 0.7);

	let fn_handleMouseOut = (d, i, nodes) =>
		d3.select(nodes[i]).style("opacity", 1);

	/*
	 *	The datasets used.
	 */
	let originalData = [];
	let data = [];

	/*
	 *	Internal functions.
	 */
	let fn_updateData;


	/*
	 *	Helper function.
	 */
	let fn_getYDomain = function() {
		let yExtent = d3.modExtent([
			d3.min(data, d => d3.min(values, v => Object.byString(d, v))),
			d3.max(data, d => d3.max(values, v => Object.byString(d, v)))
		]);

		return [ isNaN(yMin) ? yExtent[0] : yMin, isNaN(yMax) ? yExtent[1] : yMax]		
	}

	/*
	 *	CORE function.
	 */
	function chart(selection) {
		selection.each(function() {

			let fn_xScale = d3
				.scaleBand()
				.range([padding.left, width - padding.right])
				.domain(data.map(fn_key))
				//.round(true)
				.paddingInner(padding.inner)
				.paddingOuter(padding.outer)

			let fn_yScale = d3
				.scaleLinear()
				.range([height - padding.bottom, padding.top])
				.domain(fn_getYDomain());

			let fn_barScale = d3
				.scaleLinear()
				.range([0, height - padding.top - padding.bottom])
				.domain(fn_getYDomain());

			let fn_xAxis = d3
				.axisBottom()
				.scale(fn_xScale)
				.tickSizeOuter(0)

			let fn_yAxis = d3
				.axisLeft()
				.scale(fn_yScale)
				.tickSizeOuter(0);

			let svg = d3
				.select(this)
				.append("svg")
				.attr("width", width)
				.attr("height", height);


			let barsInfo = []

			let fn_initSingleBar = function(selection, v, j) {
				selection.each(function (d, i) {

					let bar = d3.select(this)
					let x0 = fn_xScale(fn_key(d, i))
					let width = fn_xScale.bandwidth()
					let x1 = x0 + width

					bar.on("mouseover", fn_handleMouseOver)
						.on("mouseout", fn_handleMouseOut)
						//.call(tooltip)
						.attr("x", x0)
						.attr("y", fn_yScale(Object.byString(d, v)))
						.attr("width", width)
						.attr("height", fn_barScale(Object.byString(d, v)))
						.style("fill", fn_color(v, j, d, i))
						.style("fill-opacity", fn_areaOpacity(v, j))

					if(j==0) // push object only once
						barsInfo.push({
							center: (x0 + x1)/2,
							extent: [ x0, x1 ],
							key: fn_key(d, i)
						})
				})
			}

			let fn_initBars = function(selection) {
				selection.each(function (v, j) {
					let gBars = d3.select(this)

					gBars.selectAll("rect.bar")
						.data(data, fn_key)
						.enter()
						.append("rect")
						.classed("bar", true)
						.call(fn_initSingleBar, v, j)

				})
			}


			svg.selectAll("g.bars")
				.data(values)
				.enter()
				.append("g")
				.classed("bars", true)
				.call(fn_initBars)

			let chartBrusher = barBrusher()
				.width(width - padding.right - padding.left)
				.height(height - padding.top - padding.bottom)
				.x(padding.left)
				.y(padding.top)
				.barsInfo(barsInfo)

			svg.call(chartBrusher)

			let xAxis = svg
				.append("g")
				.classed("x-axis", true)
				.attr(
					"transform",
					"translate(0, " + (height - padding.bottom) + ")"
				);

			let yAxis = svg
				.append("g")
				.classed("y-axis", true)
				.attr("transform", "translate(" + padding.left + ", 0)")

			xAxis.call(fn_xAxis);
			yAxis.call(fn_yAxis);

			/*
			 *	Function called if new data comes.
			 */
			fn_updateData = function() {
				fn_xScale.domain(d3.extent(data, fn_key));

				fn_yScale.domain(fn_getYDomain());
				fn_barScale.domain(fn_getYDomain());

				fn_xAxis.tickValues(fn_xScale.domain());
/*
				let rects = svg.selectAll("rect").data(data);

				rects
					.enter()
					.append("rect")
					.merge(rects)
					.classed("bar", true)
					.on("mouseover", fn_handleMouseOver)
					.on("mouseout", fn_handleMouseOut)
					.transition()
					.call(tooltip)
					.attr("x", d => fn_xScale(d[key]))
					.attr("y", d => fn_yScale(d[value]))
					.attr("width", fn_xScale.bandwidth())
					.attr("height", d => fn_barScale(d[value]))
					.style("fill", fillColor);

				rects.exit().remove();*/

				xAxis.transition().call(fn_xAxis);
				yAxis.transition().call(fn_yAxis);
			};
		});
	}

	/*
	 *	GETTERS/SETTERS
	 */
	chart.width = function(value) {
		if (!arguments.length) return width;
		width = value;
		return chart;
	};

	chart.height = function(value) {
		if (!arguments.length) return height;
		height = value;
		return chart;
	};

	chart.padding = function(value) {
		if (!arguments.length) return padding;
		padding = value;
		return chart;
	};

	chart.fn_color = function(value) {
		if (!arguments.length) return fn_color;
		fn_color = value;
		return chart;
	};

	chart.fn_areaOpacity = function(value) {
		if (!arguments.length) return fn_areaOpacity;
		fn_areaOpacity = value;
		return chart;
	};

	chart.tooltip = function(value) {
		if (!arguments.length) return tooltip;
		tooltip = value;
		return chart;
	};

	chart.fn_key = function(value) {
		if (!arguments.length) return fn_key;
		fn_key = value;
		return chart;
	};

	chart.values = function(value) {
		if (!arguments.length) return values;
		values = value;
		return chart;
	};

	chart.fn_handleMouseOver = function(value) {
		if (!arguments.length) return fn_handleMouseOver;
		fn_handleMouseOver = value;
		return chart;
	};

	chart.fn_handleMouseOut = function(value) {
		if (!arguments.length) return fn_handleMouseOut;
		fn_handleMouseOut = value;
		return chart;
	};

	chart.data = function(value) {
		if (!arguments.length) return data;
		data = value;
		if (typeof fn_updateData === "function") fn_updateData();
		return chart;
	};

	return chart;
}


document.addEventListener("DOMContentLoaded", function(event) {

	let ciao = barChart()
		.data(Array.from({length: 50}, (x,i) => i).map(() => { return { "value": Math.random()*20 } }))
		.values(["value"])

	d3.select(".div-TEST").call(ciao)

})

