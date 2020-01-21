"use strict";

/*
 *	Labels
 */
export function polarLabels() {

	/*** VARIABLES ***/

	// view	
	
	let fn_fill = (d, i) => "red"; 
	let fn_opacity = (d, i) => 1; 

	let fn_fontSize = (d, i) => 14;

	let proportionOuterRadius = 0.15; // proportion over radius, max extent


	// scales
	let fn_angleScale,
		fn_radiusScale;


	// data
	let data;

	// data functions
	let fn_key = (d, i) => i;
	let fn_value = (d, i) => d;

	// generic call function
	let fn_call = polarLabels => {}


	/*** HANDLERS ***/

	// update functions
	let fn_updateData;



	/*** SELF FUNCTION ***/

	function self(selection) {
		selection.each(function(){

			/*** CALCULA ***/

			const radius = fn_radiusScale.range()[1]

			let fn_yScale = d3.scalePoint()
				.range([ -proportionOuterRadius * radius, proportionOuterRadius * radius ])
				.domain(data.map((d, i) => i)) // fn_defined ?

			let fn_draw = (labels, options) => {

				let t = d3.transition().duration(500)

				labels.join(
					enter => enter
						.append("text")
						.attr("alignment-baseline", "middle")
						.attr("text-anchor", "middle")
						.attr("transform", (d, i) => "translate(0, " + fn_yScale(i) + ")")
						.text(fn_value)
						.attr("font-size", fn_fontSize)
						.style("fill", fn_fill)
						.call(fn_call)
						.attr("opacity", 0)
						.call(enter => enter.transition(t)
							.delay((d, i, nodes) => options.init && nodes.length ? i * (500 / nodes.length) : 0)
							.attr("opacity", fn_opacity)), // or 1?,
					update => update
						.call(update => update
							.filter((d, i, nodes) => d3.select(nodes[i]).text() !== fn_value(d).toString()) 
							.transition()
							.style("opacity", 0)
							.on("end", (d, i, nodes) => 
								d3.select(nodes[i])
									.text(fn_value)
									.transition(t)
									.style("opacity", fn_opacity))),
					exit => exit
						.call(exit => exit.transition(t)
							.style("opacity", 0)
							.remove())
				)


			}


			/*** DRAWING ***/

			let gPolarLabels = d3.select(this)
				.append("g")
				.classed("labels", true)

			gPolarLabels.selectAll("text")
				.data(data, fn_key)
				.call(fn_draw, { init: true })


			/*** UPDATES ***/

			fn_updateData = function() {

				/*** CALCULA ***/

				fn_yScale.domain(data.map((d, i) => i)) // fn_defined ?

				/*** DRAWING ***/

				gPolarLabels.selectAll("text")
					.data(data, fn_key)
					.call(fn_draw, { init: false })

			}

		})
	}


	/*** GETTERS/SETTERS ***/ 

	// view
	self.fn_fill = function(value) {
		if (!arguments.length) return fn_fill;
		fn_fill = value;
		return self;
	}

	self.fn_fontSize = function(value) {
		if (!arguments.length) return fn_fontSize;
		fn_fontSize = value;
		return self;
	}


	self.fn_opacity = function(value) {
		if (!arguments.length) return fn_opacity;
		fn_opacity = value;
		return self;
	}

	self.proportionOuterRadius = function(value) {
		if (!arguments.length) return proportionOuterRadius;
		proportionOuterRadius = value;
		return self;
	}


	// scales
	self.fn_angleScale = function(value) {
		if (!arguments.length) return fn_angleScale;
		fn_angleScale = value;
		return self;
	}

	self.fn_radiusScale = function(value) {
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

	// generic call function
	self.fn_call = function(value) {
		if (!arguments.length) return fn_call;
		fn_call = value;
		return self;
	}
	

	return self;

}


