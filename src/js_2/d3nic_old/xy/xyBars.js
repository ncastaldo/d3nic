"use strict";

/*
 *	xyBars
 */
export function xyBars() {

	/*** VARIABLES ***/

	// direction
	let horizontal = true;

	// view	
	let padding = {inner: 0, outer: 0};
	let fn_stroke = (d, i) => "black";
	let fn_strokeWidth = (d, i) => 0;
	let fn_fill = (d, i) => "red";

	// scales
	let fn_xScale,
		fn_yScale;

	// data
	let data;

	// data functions
	let fn_key = (d, i) => d.key;
	let fn_value = (d, i) => d.value;
	let fn_defined = (d, i) => true


	// generic call function
	let fn_call = xyBars => {}


	/*** HANDLERS ***/

	// update functions
	let fn_updateData;



	/*** SELF FUNCTION ***/

	function self(selection) {
		selection.each(function(){

			/*** CALCULA ***/

			// fn_scaleBand refers to the position of the bars
			let fn_scaleBand = d3.scaleBand()
				.domain(horizontal ? data.map(fn_key) : data.map(fn_key).reverse() )				
				.paddingInner(padding.inner)
				.paddingOuter(padding.outer)

			// fn_barScale refers to the height of the bars
			let fn_barScale;

			if (horizontal) {
				fn_scaleBand.range(fn_xScale.range())

				fn_barScale = fn_yScale.copy()
					.range([0, fn_yScale.range()[0] - fn_yScale.range()[1] ])
			} else {
				fn_scaleBand.range(fn_yScale.range())

				fn_barScale = fn_xScale.copy()
					.range([0, fn_xScale.range()[1] - fn_xScale.range()[0] ])
			}

			let barWidth = fn_scaleBand.bandwidth()


			let fn_draw = (bars, options) => {

				const t = d3.transition().duration(500)

				bars.join(
					enter => enter
						.append("rect")
						.attr("x", (d, i) => horizontal ? fn_scaleBand(fn_key(d, i)) : fn_xScale.range()[0])
						.attr("width", horizontal ? barWidth : 0)
						.attr("y", (d, i) => horizontal ? fn_yScale.range()[0] : fn_scaleBand(fn_key(d, i)))
						.attr("height", horizontal ? 0 : barWidth)
						.style("stroke", fn_stroke)
						.style("stroke-width", fn_strokeWidth)
						.style("fill", fn_fill)
						.style("opacity", 0)
						.call(fn_call)
						.call(enter => enter.transition(t)
							.delay((d, i, nodes) => options.init && nodes.length ? i * (500 / nodes.length) : 0)
							.attr("width", (d, i) => horizontal ? barWidth : (fn_defined(d, i) ? fn_barScale(fn_value(d, i)) : 0))
							.attr("y", (d, i) => horizontal ? fn_yScale(fn_value(d, i)) : fn_scaleBand(fn_key(d, i)))
							.attr("height", (d, i) => horizontal ? (fn_defined(d, i) ? fn_barScale(fn_value(d, i)) : 0) : barWidth)
							.style("opacity", 1)),
					update => update
						.call(update => update.transition(t)
							.attr("width", (d, i) => horizontal ? barWidth :  (fn_defined(d, i) ? fn_barScale(fn_value(d, i)) : 0 ))
							.attr("y", (d, i) => horizontal ? fn_yScale(fn_value(d, i)) : fn_scaleBand(fn_key(d, i)))
							.attr("height", (d, i) => horizontal ? (fn_defined(d, i) ? fn_barScale(fn_value(d, i)) : 0) : barWidth)),
					exit => exit
						.call(exit => exit.transition(t)
							.attr("width", (d, i) => horizontal ? barWidth : 0)
							.attr("y", (d, i) => horizontal ? fn_yScale.range()[0] : fn_scaleBand(fn_key(d, i)))
							.attr("height", (d, i) => horizontal ? 0 : barWidth)
							.style("opacity", 0)
							.remove())
				)

			}

			/*** DRAWING ***/

			let gBars = d3.select(this)
				.append("g")
				.classed("bars", true)
				
			gBars.selectAll("rect")
				.data(data, fn_key)
				.call(fn_draw, { init: true })


			/*** UPDATES ***/

			fn_updateData = function() {

				/*** CALCULA ***/

				fn_scaleBand.domain(horizontal ? data.map(fn_key) : data.map(fn_key).reverse() )				
				fn_barScale.domain(horizontal ? fn_yScale.domain() : fn_xScale.domain())

				barWidth = fn_scaleBand.bandwidth()


				/*** DRAWING ***/

				gBars.selectAll("rect")
					.data(data, fn_key)
					.call(fn_draw, { init: false })

			}

		})
	}


	/*** GETTERS/SETTERS ***/ 

	// direction
	self.horizontal = function(value) {
		if (!arguments.length) return horizontal;
		horizontal = value;
		return self;
	};

	// view
	self.padding = function(value) {
		if (!arguments.length) return padding;
		padding = value;
		return self;
	}

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

	self.fn_fill = function(value) {
		if (!arguments.length) return fn_fill;
		fn_fill = value;
		return self;
	}

	
	// scales
	self.fn_xScale = function(value) {
		if (!arguments.length) return fn_xScale;
		fn_xScale = value;
		return self;
	};

	self.fn_yScale = function(value) {
		if (!arguments.length) return fn_yScale;
		fn_yScale = value;
		return self;
	};


	// data
	self.data = function(value) {
		if (!arguments.length) return data;
		data = value;
		if (typeof fn_updateData === "function") fn_updateData()
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
	

	return self;

}


