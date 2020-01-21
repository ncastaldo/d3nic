"use strict";

/* 
 *	Legend chart
 */
export function legendChart(){

	/*** VARIABLES ***/

	// view parameters
	let width = 100,
		height = 160,
		padding = {top: 10, right: 10, bottom: 10, left: 10},
		rectWidth = 20;

	let fn_stroke = (valueExtent, i) => "white";
	let fn_strokeWidth = (valueExtent, i) => 1;
	let fn_fontSize = (valueExtent, i) => "14px";
	let fn_text = (valueExtent, i) => "n. " + i;

	// fill parameters
	let fillScheme = d3.schemeBlues[9]
	let fillUndefined = "lightgray"

	// scales
	let fillScale = d3.scaleLinear

	// data
	let featureCollection;

	// data functions
	let fn_data = data => data;
	let fn_key = (d, i) => i;
	let fn_value = (d, i) => d;
	let fn_defined = (d, i) => !isNaN(d)

	// generic call function
	let fn_call = selection => {}
	let fn_callRects = selection => {}

	
	/*** HANDLERS ***/

	// update functions

	let fn_updateFeatureCollection;



	/*** SELF FUNCTION ***/

	function self(selection) {
		selection.each(function(){

			/*** CALCULA ***/

			//	data scales

			let fn_partialValueScale = fillScale()
				.domain(d3.extent(featureCollection.features.filter(fn_defined), fn_value))
				.range([1, fillScheme.length]) // from the domain to a float number from 1 to 10

			//	data modifier

			// returns the extents of the scale, if defined
			let fn_valueExtent = (d, i) => i ? [i, i + 1].map(fn_partialValueScale.invert) : []	

			// view scales

			let fn_yScale = d3.scaleBand()
				.domain(_.range(fillScheme.length)) 
				.range([height - padding.bottom, padding.top]) // now vertical - reversed


			// fill function

			let fn_fill = (valueExtent, i) => [fillUndefined].concat(fillScheme)[i]


			let fn_initLegendRects = function(selection){

				selection.selectAll("g")
					.data(_.range(fillScheme.length).map(fn_valueExtent), (d, i) => i)
					.enter()
					.append("g")
					.classed("legend-rect", true)
					.attr("transform", (d, i) => "translate(0, " + fn_yScale(i) + ")")
					.call(legendRects => {
						legendRects.append("rect")
							.attr("width", rectWidth)
							.attr("height", fn_yScale.bandwidth()) // may change
							.style("stroke", fn_stroke)
							.style("stroke-width", fn_strokeWidth)
							.attr("fill", fn_fill)

						legendRects.append("text")	
							.attr("alignment-baseline", "middle")
							.attr("transform", () => "translate(" + +(rectWidth+6) + ", " + (fn_yScale.bandwidth() / 2) + ")")
							.style("font-size", fn_fontSize)
							.text(fn_text)

					})
					.style("opacity", 0)
					.call(fn_callRects)
					.call(legendRects => 
						legendRects.transition("c") // put consistent
							.delay((d, i, nodes) => nodes.length ? i * (500 / nodes.length) : 0)
							.style("opacity", 1))
		
			}



			/*** DRAWING ***/

			//	svg
			let svg = d3
				.select(this)
				.append("svg")
				.attr("width", width)
				.attr("height", height)


			svg.call(fn_call)


			let gLegendRects = svg.append("g")
				.classed("legend-rects", true)
				.attr("transform", "translate(" + padding.left + ", 0)");

			gLegendRects.call(fn_initLegendRects)


			/*** UPDATES ***/

			fn_updateFeatureCollection = function() {

				fn_partialValueScale.domain(d3.extent(featureCollection.features.filter(fn_defined), fn_value))

				/*** DRAWING ***/

				let legendRects = gLegendRects
					.selectAll("g")
					.data(_.range(fillScheme.length).map(fn_valueExtent), (d, i) => i)

				let t = d3.transition("re-writing")

				legendRects.join(
					enter => enter,
					update => update
						.call(update => {
							update.select("text")
								.each((valueExtent, i, nodes) => {
									const selection = d3.select(nodes[i])
									if (selection.text() !== fn_text(valueExtent, i)) {
										selection.style("opacity", 1)
											.transition(t)
											.style("opacity", 0)
											.transition(t)
											.text(fn_text(valueExtent, i))
											.style("opacity", 1)
									}
								})
						}),
					exit => exit
				)



			}


		})
	}

	/*** GETTERS/SETTERS ***/ 

	// 	view parameters
	self.width = function(value) {
		if (!arguments.length) return width;
		width = value;
		return self;
	};

	self.height = function(value) {
		if (!arguments.length) return height;
		height = value;
		return self;
	};

	self.padding = function(value) {
		if (!arguments.length) return padding;
		padding = value;
		return self;
	};

	self.rectWidth = function(value) {
		if (!arguments.length) return rectWidth;
		rectWidth = value;
		return self;
	};


	self.fn_stroke = function(value) {
		if (!arguments.length) return fn_stroke;
		fn_stroke = value;
		return self;
	}

	self.fn_strokeWidth = function(value) {
		if (!arguments.length) return fn_strokeWidth;
		fn_strokeWidth = value;
		return self;
	}

	self.fillScheme = function(value) {
		if (!arguments.length) return fillScheme;
		fillScheme = value;
		return self;
	}

	self.fillUndefined = function(value) {
		if (!arguments.length) return fillUndefined;
		fillUndefined = value;
		return self;
	}


	self.fn_fill = function(value) {  // automatically derived! Handle this...
		if (!arguments.length) return fn_fill;
		fn_fill = value;
		return self;
	}

	// scale
	self.fillScale = function(value) { 
		if (!arguments.length) return fillScale;
		fillScale = value;
		return self;
	}

	self.fn_fontSize = function(value) {
		if (!arguments.length) return fn_fontSize;
		fn_fontSize = value;
		return self;
	};


	self.fn_text = function(value) {
		if (!arguments.length) return fn_text;
		fn_text = value;
		return self;
	};


	// data

	self.featureCollection = function(value) {
		if (!arguments.length) return featureCollection;
		featureCollection = value;
		if (typeof fn_updateFeatureCollection === "function")
			fn_updateFeatureCollection()
		return self;
	}

	// data functions
	self.fn_key = function(value) {
		if (!arguments.length) return fn_key;
		fn_key = value;
		return self;
	}

	self.fn_value = function(value) {
		if (!arguments.length) return fn_value;
		fn_value = value;
		return self;
	}

	self.fn_defined = function(value) {
		if (!arguments.length) return fn_defined;
		fn_defined = value;
		return self;
	}


	// generic call function
	self.fn_call = function(value) {
		if (!arguments.length) return fn_call;
		fn_call = value;
		return self;
	}

	// generic call function
	self.fn_callRects = function(value) {
		if (!arguments.length) return fn_callRects;
		fn_callRects = value;
		return self;
	}
	

	return self;


}

