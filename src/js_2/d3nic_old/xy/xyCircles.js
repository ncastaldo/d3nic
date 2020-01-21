"use strict";

/*
 *	Circles
 */
export function xyCircles() {

	/*** VARIABLES ***/

	// direction
	let horizontal = true;

	// view	
	let fn_radius = (d, i) => 3;
	let fn_stroke = (d, i) => "black";
	let fn_strokeWidth = (d, i) => 1;
	let fn_fill = (d, i) => "red";

	let fn_opacity = (d, i) => 1; 

	// scales
	let fn_xScale,
		fn_yScale;

	// data
	let data;

	// data functions
	let fn_key = (d, i) => i;
	let fn_value = (d, i) => d;
	let fn_defined = (d, i) => true

	// generic call function
	let fn_call = xyCircles => {}


	/*** HANDLERS ***/

	// update functions
	let fn_updateData;



	/*** SELF FUNCTION ***/

	function self(selection) {
		selection.each(function(){

			/*** CALCULA ***/

			const fn_xValue = horizontal ? fn_key : fn_value
			const fn_yValue = horizontal ? fn_key : fn_value

			let fn_draw = (circles, options) => {

				const t = d3.transition().duration(500)

				circles.join(
					enter => enter
						.append("circle")
						.attr("cx", (d, i) => fn_xScale(horizontal ? fn_key(d, i) : fn_value(d, i)))
						.attr("cy", (d, i) => fn_yScale(horizontal ? fn_value(d, i) : fn_key(d, i)))						
						.style("stroke", fn_stroke)
						.style("stroke-width", fn_strokeWidth)
						.style("fill", fn_fill)
						.style("opacity", fn_opacity)
						.attr("r", 0)
						.call(fn_call)
						.call(enter => enter.transition(t)
							.delay((d, i, nodes) => options.init && nodes.length ? i * (500 / nodes.length) : 0)
							.attr("r", fn_radius)),
					update => update
						.call(update => update.transition(t)
							.attr("cx", (d, i) => fn_xScale(horizontal ? fn_key(d, i) : fn_value(d, i)))
							.attr("cy", (d, i) => fn_yScale(horizontal ? fn_value(d, i) : fn_key(d, i)))),
					exit => exit
						.call(exit => exit.transition(t)
							.attr("r", 0)
							.remove())
				)

			}


			/*** DRAWING ***/

			let gCircles = d3.select(this)
				.append("g")
				.classed("circles", true)

			gCircles.selectAll("circle")
				.data(data.filter(fn_defined), fn_key)
				.call(fn_draw, { init: true })
				

			/*** UPDATES ***/

			fn_updateData = function() {

				/*** DRAWING ***/

				gCircles.selectAll("circle")
					.data(data.filter(fn_defined), fn_key)
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
	self.fn_radius = function(value) {
		if (!arguments.length) return fn_radius;
		fn_radius = value;
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


	self.fn_opacity = function(value) {
		if (!arguments.length) return fn_opacity;
		fn_opacity = value;
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


