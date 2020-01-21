/*
 *	Polar Area
 */
export function polarArea() {

	/*** VARIABLES ***/

	// view	
	let fn_fill = (d, i) => "red";
	let fn_fillOpacity = (d, i) => 1;

	let fn_strokeWidth = (d, i) => 2;
	let fn_opacity = (d, i) => 1;

	let curve = d3.curveLinearClosed;

	// scales
	let fn_angleScale,
		fn_radiusScale;

	// data
	let data;

	// data functions
	let fn_key = (d, i) => i;
	let fn_value = (d, i) => d;
	let fn_defined = (d, i) => true

	// generic call function
	let fn_call = area => {}


	/*** HANDLERS ***/

	// update functions
	let fn_updateData;



	/*** SELF FUNCTION ***/

	function self(selection) {
		selection.each(function(){

			/*** CALCULA ***/

			//	area generator
			let fn_area = d3.areaRadial()
				.defined(fn_defined)
				.angle((d, i) => fn_angleScale(fn_key(d, i)))
				.innerRadius(fn_radiusScale.range()[0]) 
				.outerRadius((d, i) => fn_radiusScale(fn_value(d, i)))
				.curve(curve);


			let fn_draw = area => {

				const tInit = d3.transition().duration(1000)

				const tUpdate = d3.transition()

				area.join(
					enter => enter
						.append("path")
						.attr("fill", fn_fill) 
						.attr("fill-opacity", fn_fillOpacity)
						.attr("d", fn_area)
						.style("opacity", 0)
						.call(fn_call)
						.call(enter => {
							enter.transition(tInit)
								.style("opacity", 1)
						}),
					update => update
						.call(update => update.transition(tUpdate)
							.style("opacity", 0)
							.on("end", () => {
								fn_area.outerRadius((d, i) => fn_radiusScale(fn_value(d, i)))
								update.attr("d", fn_area)
							})
							.transition(tUpdate)
							.style("opacity", 1)
						)
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

				//	area generator
				fn_area.angle((d, i) => fn_angleScale(fn_key(d, i)))
					.innerRadius(fn_radiusScale.range()[0])
					//.outerRadius((d, i) => fn_radiusScale(fn_value(d, i)))


				/*** DRAWING ***/

				// area
				gArea.selectAll("path")
					.data([data])
					.call(fn_draw)

			}

		})
	}


	/*** GETTERS/SETTERS ***/ 

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

	self.curve = function(value) {
		if (!arguments.length) return curve;
		curve = value;
		return self;
	}


	// scales
	self.fn_angleScale = function(value) {
		if (!arguments.length) return fn_angleScale;
		fn_angleScale = value;
		return self;
	}

	self.fn_radiusScale = function(value) {
		if (!arguments.length) return fn_radiusScale;
		fn_radiusScale = value;
		return self;
	}


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


