"use strict";

/*
 *	Mouse lines
 */
export function xyMouseLines() {

	/*** VARIABLES ***/

	// direction
	let horizontal = true;

	// view	
	let fn_stroke = (d, i) => "black";
	let fn_strokeWidth = (d, i) => 1;
	let fn_strokeDasharray = (d, i) => [2, 2];

	let fn_opacity = (d, i) => 0; // default not visible


	// scales
	let fn_xScale;
	let fn_yScale;

	// data
	let data;


	// data functions
	let fn_key = (d, i) => i;
	let fn_defined = (d, i) => true;

	// generic call function
	let fn_call = xyMouseLines => {}


	/*** HANDLERS ***/

	// update functions
	let fn_updateData;



	/*** SELF FUNCTION ***/

	function self(selection) {
		selection.each(function(){

			/*** CALCULA ***/

			let yExtent = fn_yScale.range()

			let fn_draw = mouseLines => {

				mouseLines.join(
					enter => enter
						.append("path")
						.attr("d", (d, i) => "M" + fn_xScale(fn_key(d, i)) + "," + yExtent[0] + " " 
							+ fn_xScale(fn_key(d, i)) + "," + yExtent[1])
						.style("stroke", fn_stroke)
						.style("stroke-width", fn_strokeWidth)
						.style("stroke-dasharray", (d, i) => fn_strokeDasharray(d, i)[0] + "," + fn_strokeDasharray(d, i)[1])
						.style("opacity", fn_opacity)
						.call(fn_call),
					update => update
						.attr("d", (d, i) => "M" + fn_xScale(fn_key(d, i)) + "," + yExtent[0] + " " 
							+ fn_xScale(fn_key(d, i)) + "," + yExtent[1]),
					exit => exit
						.remove()
				)
			
			}


			/*** DRAWING ***/

			let gMouseLines = d3.select(this)
				.append("g")
				.classed("mouse-lines", true)

			gMouseLines.selectAll("path")
				.data(data.filter(fn_defined), fn_key)
				.call(fn_draw)

			/*** UPDATES ***/

			fn_updateData = function() {

				/*** CALCULA ***/

				yExtent = fn_yScale.range()

				/*** DRAWING ***/

				gMouseLines.selectAll("path")
					.data(data.filter(fn_defined), fn_key)
					.call(fn_draw)

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

	self.yExtent = function(value) {
		if (!arguments.length) return yExtent;
		yExtent = value;
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

	self.fn_strokeDasharray = function(value) {
		if (!arguments.length) return fn_strokeDasharray;
		fn_strokeDasharray = value;
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


