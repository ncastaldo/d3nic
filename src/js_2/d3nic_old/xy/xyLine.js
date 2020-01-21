/*
 *	Line
 */
export function xyLine() {

	/*** VARIABLES ***/

	// direction
	let horizontal = true;

	// view	
	let fn_stroke = (d, i) => "red";
	let fn_strokeWidth = (d, i) => 2;
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
	let fn_call = line => {}


	/*** HANDLERS ***/

	// update functions
	let fn_updateData;



	/*** SELF FUNCTION ***/

	function self(selection) {
		selection.each(function(){

			/*** CALCULA ***/

			//	line generator
			let fn_line = d3.line()
				.defined(fn_defined)
				.x((d, i) => fn_xScale(horizontal ? fn_key(d, i) : fn_value(d, i)))
				.y((d, i) => fn_yScale(horizontal ? fn_value(d, i) : fn_key(d, i)))
				.curve(d3.curveMonotoneX);


			let fn_draw = line => {

				const tInit = d3.transition().duration(1000)

				const tUpdate = d3.transition()

				line.join(
					enter => enter
						.append("path")
						.attr("fill", "none") // to make it a line
						.attr("stroke", fn_stroke)
						.attr("stroke-width", fn_strokeWidth)
						.attr("d", fn_line)
						.style("opacity", fn_opacity)
						.call(fn_call)
						.call(enter => {

							const lineLength = enter.node() ? enter.node().getTotalLength() : 0

							enter.attr("stroke-dasharray", lineLength + " " + lineLength)
								.attr("stroke-dashoffset", lineLength)
								.transition(tInit)
								.attr("stroke-dashoffset", 0);

						}),
					update => update
						.call(update => update.transition(tUpdate)
							.style("opacity", 0)
							.on("end", () => {
								update.attr("d", fn_line)
									.attr("stroke-dasharray", null)
									.attr("stroke-dashoffset", null)
							})
							.transition(tUpdate)
							.style("opacity", 1)
						)
				)

			}

			/*** DRAWING ***/

			// line
			let gLine = d3.select(this)
				.append("g")
				.classed("line", true)

			gLine.selectAll("path")
				.data([data])
				.call(fn_draw)

			/*** UPDATES ***/

			fn_updateData = function() {

				/*** CALCULA ***/

				//	line generator
				fn_line
					.x((d, i) => fn_xScale(horizontal ? fn_key(d, i) : fn_value(d, i)))
					.y((d, i) => fn_yScale(horizontal ? fn_value(d, i) : fn_key(d, i)))
			

				/*** DRAWING ***/

				// line
				gLine.selectAll("path")
					.data([data])
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


