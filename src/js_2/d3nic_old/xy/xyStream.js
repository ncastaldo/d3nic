"use strict";

/*
 *	Streamgraph
 */
export function xyStream() {

	/*** VARIABLES ***/

	// direction
	let horizontal = true;

	// view	

	let fn_opacity = (d, i) => 1; 
	let fn_fill = (d, i) => d3.schemeBlues[9][i]; 

	// scales
	let fn_xScale,
		fn_yScale;

	// data
	let data;

	let fn_stackKeys = (d, i) => i;
	let fn_stackValue = (d, key) => d[key];

	// data functions
	let fn_key = (d, i) => i;
	let fn_value = (d, i) => d;

	// generic call function
	let fn_call = xyStream => {}


	/*** HANDLERS ***/

	// update functions
	let fn_updateData;



	/*** SELF FUNCTION ***/

	function self(selection) {
		selection.each(function(){

			/*** CALCULA ***/

			const fn_xValue = horizontal ? fn_key : fn_value
			const fn_yValue = horizontal ? fn_key : fn_value

			//stack the data
			const fn_stack = d3.stack()
				//.offset(d3.stackOffsetSilhouette)
				.keys(fn_stackKeys)
				.value(fn_stackValue)


			let stackData = fn_stack(data)

			console.log(stackData)


			let fn_area = d3.area()
				.x((d, i) => fn_xScale(fn_key(d.data, d.index)))
				.y0((d, i) => fn_yScale(d[0])) 
				.y1((d, i) => fn_yScale(d[1]))
				.curve(d3.curveMonotoneX);


			let fn_draw = (stream, options) => {

				const t = d3.transition().duration(500)

				stream.join(
					enter => enter
						.append("path")
						.style("fill", fn_fill)
						.attr("d", fn_area)
						.call(fn_call)
						.style("opacity", 0)
						.call(enter => enter.transition(t)
							.delay((d, i, nodes) => options.init && nodes.length ? i * (500 / nodes.length) : 0)
							.style("opacity", fn_opacity)),
					update => update
						.call(update => update.transition(t)
							.attr("d", fn_area)),
					exit => exit
						.call(exit => exit.transition(t)
							.remove())
				)

			}


			/*** DRAWING ***/

			let gStream = d3.select(this)
				.append("g")
				.classed("stream", true)

			gStream.selectAll("path")
				.data(stackData)
				.call(fn_draw, { init: true })
				

			/*** UPDATES ***/

			fn_updateData = function() {

				/*** DRAWING ***/

				stackData = fn_stack(data)

				gStream.selectAll("path")
					.data(stackData)
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

	self.fn_fill = function(value) {
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

	self.fn_stackKeys = function(value) {
		if (!arguments.length) return fn_stackKeys;
		fn_stackKeys = value;
		return self;
	}

	self.fn_stackValue = function(value) {
		if (!arguments.length) return fn_stackValue;
		fn_stackValue = value;
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

	// generic call function
	self.fn_call = function(value) {
		if (!arguments.length) return fn_call;
		fn_call = value;
		return self;
	}
	

	return self;

}


