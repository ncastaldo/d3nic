"use strict";

/*
 *	Linear gradient
 */
export function linearGradient() {

	/*** VARIABLES ***/

	let id = "linear-gradient-42"

	let coordinates = { x1: 0, y1: 0, x2: 0, y2: 100 }

	// data
	let data = [
		{offset: 0, stopColor: "red", stopOpacity: 1 },
		{offset: 100, stopColor: "blue", stopOpacity: 1}
	]

	// generic call function
	let fn_call = gradient => {}

	/*** SELF FUNCTION ***/

	function self(selection) {
		selection.each(function(){

			/*** DRAWING ***/

			selection.append("linearGradient")			
				.attr("id", id)
				.attr("gradientUnits", "objectBoundingBox")//"userSpaceOnUse")	
				.attr("x1", coordinates.x1 + "%")
				.attr("y1", coordinates.y1 + "%")			
				.attr("x2", coordinates.x2 + "%")
				.attr("y2", coordinates.y2 + "%")		
				.selectAll("stop")
				.data(data)					
				.enter()
				.append("stop")			
				.attr("offset", d => d.offset + "%")	
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


