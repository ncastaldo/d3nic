"use strict";

import { tooltip } from "./tooltip.js";
import { mouseLine } from "./mouseLine.js";

/*
 *
 *	Line chart.
 *
 */
export function lineChart() {
	/*
	 *	MAIN variables default values.
	 */
	let width,
		height = 200,
		padding = {top: 30, right: 30, bottom: 30, left: 40},
		fn_key = (d, i) => i,
		fn_color = (v, j, d, i) => d3.schemeCategory10[j],
		fn_areaOpacity = (v, j) => 0.5,
		lineStrokeWidth = 2,
		yMin,
		yMax;

	/*
	 *	Variables related to the data default values.
	 *	The "values" is an array and refers to the keys related to
	 *	the values for each lineChart
	 */
	let values = ["value"];

	/*
	 *	The dataset used.
	 */
	let data = [];

	let fn_xScale = d3.scaleLinear();
	let fn_yScale = d3.scaleLinear();

	let fn_xAxis = d3.axisBottom();
	let fn_yAxis = d3.axisLeft();

	let fn_tooltipTitleText = (d, i) => i;
	let fn_tooltipBodyText = (v, j, d, i) => Object.byString(d, v);


	/*
	 *	Internal functions.
	 */
	let fn_updateWidth;
	let fn_updateData;
	let fn_updateValues;



	/*
	 *	Helper function.
	 */
	let fn_getYDomain = function() {
		let yExtent = d3.modExtent([
			d3.min(data, d => d3.min(values, v => Object.byString(d, v))),
			d3.max(data, d => d3.max(values, v => Object.byString(d, v)))
		]);
		return [ 
			isNaN(yMin) || yExtent[0] > yMin ? yExtent[0] : yMin,
			isNaN(yMax) || yExtent[1] < yMax ? yExtent[1] : yMax
		]		
	}

	/*
	 *	CORE function.
	 */
	function chart(selection) {
		selection.each(function() {

			width = this.offsetWidth;

			fn_xScale.range([padding.left, width - padding.right])
				.domain(d3.extent(data, fn_key))

			fn_yScale.range([height - padding.bottom, padding.top])
				.domain(fn_getYDomain());

			fn_xAxis.scale(fn_xScale)
				.tickSizeInner(0)
				.tickSizeOuter(0)
				.tickPadding(6)

			fn_yAxis.scale(fn_yScale)
				.tickSizeOuter(0)

			let fn_line = d3
				.line()
				.x((d, i) => fn_xScale(fn_key(d, i)))
				.curve(d3.curveMonotoneX);

			let fn_area = d3
				.area()
				.x((d, i) => fn_xScale(fn_key(d, i)))
				.y0(height - padding.bottom)
				.curve(d3.curveMonotoneX);

			let chartTooltip = tooltip(d3.select(this))
				.fn_key(fn_key)
				.values(values)
				.fn_color(fn_color)
				.fn_titleText(fn_tooltipTitleText)
				.fn_bodyText(fn_tooltipBodyText)
			
			/*
			 *	Drawing things.
			 */
			let svg = d3
				.select(this)
				.append("svg")
				.attr("width", width)
				.attr("height", height);

			let fn_initArea = function(selection, v, j) {
				fn_area.defined(d => !isNaN(_.get(d, v)))
					.y1(d => fn_yScale(Object.byString(d, v)));

				selection.attr("d", fn_area)
					.attr("fill", fn_color(v, j))
					.style("opacity", fn_areaOpacity(v, j));
			}

			let fn_initLine = function(selection, v, j) {
				fn_line.defined(d => !isNaN(_.get(d, v)))
					.y(d => fn_yScale(Object.byString(d, v)));

				selection.attr("d", fn_line)
					.attr("fill", "none")
					.attr("stroke", fn_color(v, j)) // todo config
					.attr("stroke-width", lineStrokeWidth); // todo config	
			}

			let fn_initLineArea = function(selection) {
				selection.each(function(v, j) {

					let gPath = d3.select(this)

					gPath.append("path")
						.classed("area", true)
						.datum(data, fn_key)
						.call(fn_initArea, v, j)

					gPath.append("path")
						.classed("line", true)
						.datum(data, fn_key)
						.call(fn_initLine, v, j)					

				})
			}


			let fn_updateLineArea = function(selection) {
				selection.each(function (v, j) {

					let gPath = d3.select(this)

					gPath.select("path.area")
						.datum(data, fn_key)
						.call(fn_initArea, v, j)

					gPath.select("path.line")
						.datum(data, fn_key)
						.call(fn_initLine, v, j)
					
				})
			}



			svg.selectAll("g.line-area")
				.data(values)
				.enter()
				.append("g")
				.classed("line-area", true)
				.call(fn_initLineArea)	


			let chartMouseLine = mouseLine(svg)
				.fn_key(fn_key)
				.values(values)
				.y0(height - padding.top)
				.y1(padding.bottom)
				.fn_xScale(fn_xScale)
				.fn_yScale(fn_yScale)
				.fn_color(fn_color)

			let fn_initMouseLineRect = function(selection) {
				selection.each(function(d, i) {

					let singleWidth = width - padding.right - padding.left;
					let shift = 0;

					if(data.length && data.length - 1){
						singleWidth = (width - padding.right - padding.left) / (data.length - 1)  ; // check on data length != 0
						shift = (singleWidth * i) - (singleWidth / 2);
						singleWidth = i==0 || i==data.length-1 ? singleWidth / 2 : singleWidth;
						shift = (i==0) ? 0 : shift;
					}

					d3.select(this)
						.attr("width", singleWidth)// check on data length != 0
						.attr("height", height - padding.top - padding.bottom)		
						.attr("x", padding.left)
						.attr("y", padding.top)
						.attr("transform", "translate(" + shift + ", 0)")	
						.style("fill", "none")
						.style("pointer-events", "all")
						.call(chartMouseLine, i)
						.call(chartTooltip, i);
				})
			}

			let fn_updateMouseLineRect = function(selection) {
				selection.each(function (d, i) {

					let singleWidth = width - padding.right - padding.left;
					let shift = 0;

					if(data.length && data.length - 1){
						singleWidth = (width - padding.right - padding.left) / (data.length - 1)  ; // check on data length != 0
						shift = (singleWidth * i) - (singleWidth / 2);
						singleWidth = i==0 || i==data.length-1 ? singleWidth / 2 : singleWidth;
						shift = (i==0) ? 0 : shift;
					}

					d3.select(this)
						.attr("width", singleWidth)
						.attr("transform", "translate(" + shift + ", 0)")

				})
			}

			svg.selectAll("rect")
				.data(data, fn_key)
				.enter()
				.append("rect")
				.classed("mouse-line__rect", true)
				.call(fn_initMouseLineRect)


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
				.attr("transform", "translate(" + padding.left + ", 0)");
			// .tickFormat(d3.format("d"))


			xAxis.call(fn_xAxis);
			yAxis.call(fn_yAxis);


			fn_updateWidth = () => {

				width = this.offsetWidth;

				svg.attr("width", width)

				fn_xScale.range([padding.left, width - padding.right])

				svg.selectAll("g.line-area")
					.call(fn_updateLineArea)

				chartMouseLine.fn_xScale(fn_xScale)

				svg.selectAll("rect.mouse-line__rect")
					.call(fn_updateMouseLineRect)

				xAxis.call(fn_xAxis);

			}


			/*
			 *	Function called if new data come.
			 */
			fn_updateData = function() {

				fn_xScale.domain(d3.extent(data, fn_key));
				fn_yScale.domain(fn_getYDomain());

				fn_xAxis.scale(fn_xScale);
				fn_yAxis.scale(fn_yScale);

				svg.selectAll("g.line-area")
					.call(fn_updateLineArea)

				let rects = svg.selectAll("rect.mouse-line__rect")
					.data(data, fn_key)
				
				rects.enter()
					.append("rect")
					.classed("mouse-line__rect", true)
					.call(fn_initMouseLineRect)
					.merge(rects)
					.call(fn_updateMouseLineRect)

				rects.exit().remove()

				xAxis.transition().call(fn_xAxis);
				yAxis.transition().call(fn_yAxis);
			};

			fn_updateValues = function() {

				fn_yScale.domain(fn_getYDomain());
				fn_yAxis.scale(fn_yScale);


				chartTooltip.values(values)
				chartMouseLine.values(values)

				let gLineArea = svg.selectAll("g.line-area")
					.data(values)

				gLineArea.enter()
					.append("g")
					.classed("gLineArea", true)
					.call(fn_initLineArea)
					.merge(gLineArea)
					.call(fn_updateLineArea)

				gLineArea.exit().transition().style("opacity",0).remove()

				yAxis.transition().call(fn_yAxis);

			}

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

	chart.updateWidth = function() {
		if (typeof fn_updateWidth === "function") fn_updateWidth()
		return chart;
	}

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

	chart.lineStrokeWidth = function(value) {
		if (!arguments.length) return lineStrokeWidth;
		lineStrokeWidth = value;
		return chart;
	};

	chart.yMin = function(value) {
		if (!arguments.length) return yMin;
		yMin = value;
		return chart;
	};

	chart.yMax = function(value) {
		if (!arguments.length) return yMax;
		yMax = value;
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
		if (typeof fn_updateValues === "function") fn_updateValues();
		return chart;
	};

	chart.fn_xScale = function(value) {
		if (!arguments.length) return fn_xScale;
		fn_xScale = value;
		return chart;
	};

	chart.fn_yScale = function(value) {
		if (!arguments.length) return fn_yScale;
		fn_yScale = value;
		return chart;
	};

	chart.fn_xAxis = function(value) {
		if (!arguments.length) return fn_xAxis;
		fn_xAxis = value;
		return chart;
	};

	chart.fn_yAxis = function(value) {
		if (!arguments.length) return fn_yAxis;
		fn_yAxis = value;
		return chart;
	};

	chart.fn_tooltipTitleText = function(value) {
		if (!arguments.length) return fn_tooltipTitleText;
		fn_tooltipTitleText = value;
		return chart;
	}

	chart.fn_tooltipBodyText = function(value) {
		if (!arguments.length) return fn_tooltipBodyText;
		fn_tooltipBodyText = value;
		return chart;
	}

	chart.data = function(value) {
		if (!arguments.length) return data;
		data = value;
		if (typeof fn_updateData === "function") fn_updateData();
		return chart;
	};

	return chart;
}

/*
document.addEventListener("DOMContentLoaded", function(event) {
	let data = [
		{ id: 3, tot: 11, m: 2, f: 9 },
		{ id: 4, tot: 20, m: 7, f: 13 },
		{ id: 5, tot: 24, m: 2, f: 22 },
		{ id: 6, tot: 31, m: 5, f: 26 },
		{ id: 7, tot: 20, m: 7, f: 13 }
	];

	let colorAssociation = { tot: "lightgray", m: "blue", f: "red" }

	let myChart = lineChart()
		.width(300)
		.height(200)
		.data(data)
		//.fn_key((d, i) => Object.byString(d, "id"))
		.fn_color((v, j, d, i) => Object.byString(colorAssociation, v))
		.fn_areaOpacity((v, j) => 1)
		//.fn_tooltipTitle((d, i) => "Number: "+ i)
		//.fn_tooltipBody((v, j) => values[i])
		.values(["tot", "m"])
		.yMin(0)

	let myChart2 = lineChart()
		.width(300)
		.height(200)
		.data(data)
		.fn_color((v, j, d, i) => Object.byString(colorAssociation, v))
		.fn_areaOpacity((v, j) => 1)
		.values(["tot", "f"])
		.yMin(0);

	myChart(d3.select(".div-TEST1"));
	myChart2(d3.select(".div-TEST2"));

	setTimeout(() => {
		data = data.concat([
			{ id: 8, tot: 31, m: 5, f: 26 },
			{ id: 9, tot: 20, m: 7, f: 13 },
			{ id: 10, tot: 24, m: 1, f: 23 },
			{ id: 11, tot: 38, m: 18, f: 20 }
		]);
		myChart.data(data);
	}, 4000);

	setTimeout(() => {
		myChart.values(["tot"]);
	}, 6000);

	setTimeout(() => {
		myChart.values(["m"]);
	}, 8000);

	setTimeout(() => {
		data = data.concat([
			{ id: 16, tot: 21, m: 5, f: 16 },
			{ id: 20, tot: 4, m: 1, f: 3 },
		]);
		myChart.data(data);
	}, 10000);

	setTimeout(() => {
		data = [data[5], data[8]]
		myChart.data(data);
	}, 12000);

});
*/