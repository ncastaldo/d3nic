/*
 *	Area
 */
export function xyArea() {

	/*** VARIABLES ***/

	// direction
	let horizontal = true;

	// view	
	let fn_fill = (d, i) => "red";
	let fn_fillOpacity = (d, i) => 1;

	// scales
	let fn_xScale,
		fn_yScale;

	// data
	let data;

	// data functions
	let fn_key = (d, i) => i;
	let fn_value = (d, i) => d;
	let fn_defined = (d, i) => true;

	// generic call function
	let fn_call = xyArea => {}


	/*** HANDLERS ***/

	// update functions
	let fn_updateData;



	/*** SELF FUNCTION ***/

	function self(selection) {
		selection.each(function(){

			/*** CALCULA ***/

			//	line generator
			let fn_area = d3.area()
				.defined(fn_defined)
				.curve(horizontal ? d3.curveMonotoneX : d3.curveMonotoneY);

			if (horizontal)
				fn_area
					.x((d, i) => fn_xScale(fn_key(d, i)))
					.y0(fn_yScale.range()[0]) 
					.y1(fn_yScale.range()[0]) // will be modified in the transition
			else
				fn_area
					.x0(fn_xScale.range()[0])
					.x1(fn_xScale.range()[0]) // will be modified in the transition
					.y((d, i) => fn_yScale(fn_key(d, i))) 



			let fn_draw = area => {

				const tInit = d3.transition().duration(1000)

				const tUpdate = d3.transition()

				area.join(
					enter => enter
						.append("path")
						.attr("fill", fn_fill) 
						.attr("fill-opacity", fn_fillOpacity) 
						.attr("d", fn_area)
						.call(fn_call)
						.call(enter => {

							if (horizontal)
								fn_area.y1((d, i) => fn_yScale(fn_value(d, i)))
							else
								fn_area.x1((d, i) => fn_xScale(fn_value(d, i)))

							enter.transition(tInit)
								.attr("d", fn_area)

						}),
					update => update
						.call(update => update.transition(tUpdate)
							.style("opacity", 0)
							.on("end", () => {
								if (horizontal)
									fn_area.y1((d, i) => fn_yScale(fn_value(d, i)))
								else
									fn_area.x1((d, i) => fn_xScale(fn_value(d, i)))
								update.attr("d", fn_area)
							})
							.transition(tUpdate)
							.style("opacity", 1))
				)

			}

			/*** DRAWING ***/

			// area
			let gArea = d3.select(this)
				.append("g")
				.classed("area", true)
			
			gArea.selectAll("path")
				.data([data])
				.call(fn_draw)


			/*** UPDATES ***/

			fn_updateData = function() {

				/*** CALCULA ***/

				if (horizontal)
					fn_area
						.x((d, i) => fn_xScale(fn_key(d, i)))
						.y1(fn_yScale.range()[0]) 
				else
					fn_area
						.x1(fn_xScale.range()[0]) 
						.y((d, i) => fn_yScale(fn_key(d, i))) 

			

				/*** DRAWING ***/

				gArea.selectAll("path")
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
	self.fn_fill = function(value) {
		if (!arguments.length) return fn_fill;
		fn_fill = value;
		return self;
	}

	self.fn_fillOpacity = function(value) {
		if (!arguments.length) return fn_fillOpacity;
		fn_fillOpacity = value;
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


