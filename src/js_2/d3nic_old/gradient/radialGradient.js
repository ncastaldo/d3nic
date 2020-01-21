"use strict";

/*
 *	Radial gradient
 */
export function radialGradient() {

	/*** VARIABLES ***/

	let id = "radial-gradient-42"

	let coordinates = { cx: 0, cy: 0, r: "50%" }

	let gradientUnits = "objectBoundingBox" //"userSpaceOnUse"

	// data
	let data = [
		{offset: "0%", stopColor: "red", stopOpacity: 1 },
		{offset: "100%", stopColor: "blue", stopOpacity: 1}
	]

	// generic call function
	let fn_call = gradient => {}

	/*** SELF FUNCTION ***/

	function self(selection) {
		selection.each(function(){

			/*** DRAWING ***/

			selection.append("radialGradient")			
				.attr("id", id)
				.attr("gradientUnits", gradientUnits)
				.attr("cx", coordinates.cx )
				.attr("cy", coordinates.cy )	
				.attr("r", coordinates.r )			
				.selectAll("stop")
				.data(data)					
				.enter()
				.append("stop")			
				.attr("offset", d => d.offset )	
				.style("stop-color", d => d.stopColor )
				.style("stop-opacity", d => d.stopOpacity )

				
		})
	}


	/*** GETTERS/SETTERS ***/ 

	// id
	self.id = function(value) {
		if (!arguments.length) return id;
		id = value;
		return self;
	}

	// coordinates
	self.coordinates = function(value) {
		if (!arguments.length) return coordinates;
		coordinates = value;
		return self;
	}

	// gradientUnits
	self.gradientUnits = function(value) {
		if (!arguments.length) return gradientUnits;
		gradientUnits = value;
		return self;
	}

	// data
	self.data = function(value) {
		if (!arguments.length) return data;
		data = value;
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


