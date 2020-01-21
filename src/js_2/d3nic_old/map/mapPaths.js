"use strict";

/*
 *	Map paths a.k.a. geoPath(?)
 */
export function mapPaths() {

	/*** VARIABLES ***/

	let fn_stroke = (d, i) => "black";
	let fn_strokeWidth = (d, i) => 1;


	// fill parameters
	let fillScheme = d3.schemeBlues[9]
	let fillUndefined = "lightgray"

	// scales
	let fillScale = d3.scaleLinear


	// projection
	let fn_projection;

	// data
	let featureCollection;

	// data functions
	let fn_key = (d, i) => i;
	let fn_value = (d, i) => d;
	let fn_defined = (d, i) => !isNaN(d)

	// generic call function
	let fn_call = mapPaths => {}


	/*** HANDLERS ***/

	// update functions
	let fn_updateFnProjection;

	let fn_updateFeatureCollection;





	/*** SELF FUNCTION ***/

	function self(selection) {
		selection.each(function(){

			/*** CALCULA ***/

			let fn_geoPath = d3.geoPath().projection(fn_projection);

			let fn_partialFillScale = fillScale()
				.domain(d3.extent(featureCollection.features.filter(fn_defined), fn_value))
				.range([1, fillScheme.length]) // param

			let fn_fillScale = d3.scaleQuantize()
				.domain([0, fillScheme.length]) // adding the 0 :D - param
				.range([fillUndefined].concat(fillScheme)) // param

			let fn_fill = (d, i) => fn_fillScale(
				fn_defined(d, i) ? fn_partialFillScale(fn_value(d, i)) : 0
			)

			/*** DRAWING ***/

			let gMapPaths = d3.select(this)
				.append("g")
				.classed("map-paths", true)


			gMapPaths.selectAll("path")
				.data(featureCollection.features, fn_key)
				.enter()
				.append("path")
				.attr("d", fn_geoPath)
				.style("stroke", fn_stroke)
				.style("stroke-width", fn_strokeWidth)
				.style("fill", fn_fill)
				.style("fill-opacity", 0)
				.call(fn_call)
				.call(mapPaths => mapPaths.transition("coloring")
					.delay((d, i, nodes) => nodes.length ? i * (500 / nodes.length) : 0)
					.style("fill-opacity", 1))


			/*** UPDATES ***/

			fn_updateFnProjection = function() {

				/*** CALCULA ***/

				fn_geoPath.projection(fn_projection)

				/*** DRAWING ***/

				gMapPaths.selectAll("path")
					.transition("zooming")
					.duration(750)
					.attr("d", fn_geoPath)


			}

			fn_updateFeatureCollection = function() {


				fn_partialFillScale.domain(d3.extent(featureCollection.features.filter(fn_defined), fn_value))




				/*** DRAWING ***/

				let mapPaths = gMapPaths
					.selectAll("path")
					.data(featureCollection.features, fn_key)

				let t = d3.transition("re-coloring").duration(500)

				mapPaths.join(
					enter => enter
						.append("path")
						.style("stroke", fn_stroke)
						.style("stroke-width", fn_strokeWidth)
						.style("fill", fn_fill)
						.style("fill-opacity", 0)
						.call(fn_call)
						.call(enter => enter.transition(t)
							.delay((d, i) => enter.length ? i * (500 / enter.length) : 0)
							.style("fill-opacity", 1)),
					update => update
						.call(update => update.transition(t)
							.style("fill", fn_fill)),
					exit => exit.call(exit => exit.transition(t)
						.style("fill-opacity", 0)
						.style("stroke-width", 0)
						.remove())
				)



			}

		})
	}


	/*** GETTERS/SETTERS ***/ 

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

	
	// projection
	self.fn_projection = function(value) {
		if (!arguments.length) return fn_projection;
		fn_projection = value;
		if (typeof fn_updateFnProjection === "function")
			fn_updateFnProjection()
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
	

	return self;

}


