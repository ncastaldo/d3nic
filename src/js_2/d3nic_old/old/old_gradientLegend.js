"use strict";

/*
 *
 *	Gradient legend.
 *
 */
export function gradientLegend(name) {
	/*
	 *	MAIN variables default values.
	 */
	let width,
		height = 75,
		padding = { top: 40, right: 20, bottom: 20, left: 20 },
		colors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"],
		invalidColor = "url(#diagonal-stripe-1)",
		invalidText = "no data",
		domainCenter = NaN;


	// todo set true default
	let fn_filterValid = (d, i) => fn_key(d, i) > 0


	let fn_xScale = d3.scaleLinear()
	let fn_xAxis = d3.axisTop()
	let fn_filterTicks = (t, i) => false; //keep everything

	let domain = [NaN, NaN];

	let fn_key = (d, i) => i;
	let data;

	let fn_updateWidth;
	let fn_updateData;


	// for the moment not modifiable
	let invalidWidthRatio = 1/10;
	let invalidDistanceRatio = 1/10;


	function getDomain() {
		if (!isNaN(domainCenter)) {
			const maxDistance = d3.max( data.filter(fn_filterValid).map(fn_key), (d, i) => Math.abs(d - domainCenter) )
			return [domainCenter - maxDistance, domainCenter + maxDistance].map( (d, i) => domain[i] || d )
		}
		return d3.extent( data.filter(fn_filterValid).map(fn_key), (d, i) => domain[i] || d )
	}

	/*
	 *	CORE function.
	 */
	function chart(selection) {
		selection.each(function() {

			if (!width) width = this.offsetWidth

			let svg = d3
				.select(this)
				.append("svg")
				.attr("width", width)
				.attr("height", height);

			let linearGradient = svg
				.append("defs")
				.append("linearGradient")
				.attr("id", "linear-gradient-"+name);
			// the url should be better identified!! (or not?)

			for (let i in colors) {
				linearGradient
					.append("stop")
					.attr("offset", (100 / (colors.length - 1)) * i + "%")
					.attr("stop-color", colors[i]);
			}

			let validLeftPadding = padding.left;
			let invalidWidth = invalidWidthRatio * (width - padding.left - padding.right)
			let invalidDistance = invalidDistanceRatio * (width - padding.left - padding.right)

			let invalidRect = null;
			let invalidLabel = null; 

			if(invalidColor){

				validLeftPadding = padding.left + invalidWidth + invalidDistance

				invalidRect = svg.append("rect")
					.attr("y", padding.top)
					.attr("x", padding.left)
					.attr("height", height - padding.top - padding.bottom)
					.attr("width", invalidWidth) 
					.style("fill", invalidColor);

				invalidLabel = svg.append("text")
					.attr("transform", "translate(" + (padding.left + invalidWidth/2) + ", " + padding.top + ")")
					.attr("text-anchor", "middle")
					.attr("y", -6) // keeping default axis settings
					.attr("font-size", 10) // keeping default axis settings
					.text(invalidText)
				
			}

			let rect = svg
				.append("rect")
				.attr("y", padding.top)
				.attr("x", validLeftPadding)
				.attr("height", height - padding.top - padding.bottom)
				.attr("width", width - validLeftPadding - padding.right)
				.style("fill", "url(#linear-gradient-"+name+")");


			fn_xScale.domain(getDomain())
				.range([validLeftPadding, width - padding.right - 1])

			fn_xAxis.scale(fn_xScale)				
				.tickSizeOuter(0)

			let xAxis = svg.append("g")
				.classed("x-axis", true)
				.attr("transform", "translate(0, " + padding.top + ")");
			
			xAxis.call(fn_xAxis)
				.selectAll(".tick text")
				.filter(fn_filterTicks)
				.remove()

			fn_updateWidth = () => {

				width = this.offsetWidth

				svg.attr("width", width)

				if (invalidColor) {
					
					invalidWidth = invalidWidthRatio * (width - padding.left - padding.right)
					invalidDistance = invalidDistanceRatio * (width - padding.left - padding.right)

					validLeftPadding = padding.left + invalidWidth + invalidDistance

					invalidRect.attr("width", invalidWidth)

					invalidLabel.attr("transform", "translate(" + (padding.left + invalidWidth/2) + ", " + padding.top + ")")
				}

				rect.attr("x", validLeftPadding)
					.attr("width", width - validLeftPadding - padding.right)

				fn_xScale.range([validLeftPadding, width - padding.right - 1])
			
				xAxis.call(fn_xAxis)

			}

			fn_updateData = function() {
				fn_xScale.domain(getDomain())

				fn_xAxis.scale(fn_xScale)

				xAxis.call(fn_xAxis)
					.selectAll(".tick text")
					.filter(fn_filterTicks)
					.remove();
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

	chart.colors = function(value) {
		if (!arguments.length) return colors;
		colors = value;
		return chart;
	};

	chart.fn_xScale = function(value) {
		if (!arguments.length) return fn_xScale;
		fn_xScale = value;
		return chart;
	};

	chart.fn_filterValid = function(value) {
		if (!arguments.length) return fn_filterValid;
		fn_filterValid = value;
		return chart;
	}

	chart.fn_xAxis = function(value) {
		if (!arguments.length) return fn_xAxis;
		fn_xAxis = value;
		return chart;
	};

	chart.fn_filterTicks = function(value) {
		if (!arguments.length) return fn_filterTicks;
		fn_filterTicks = value;
		return chart;
	};

	chart.domain = function(value) {
		if (!arguments.length) return domain;
		domain = value;
		return chart;
	};

	chart.fn_key = function(value) {
		if (!arguments.length) return fn_key;
		fn_key = value;
		return chart;
	};

	chart.domainCenter = function(value) {
		if (!arguments.length) return domainCenter;
		domainCenter = value;
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
