"use strict";

/* 
 *	An empty map chart
 */
export function mapChart(){

	/*** VARIABLES ***/

	// view parameters
	let width = 300,
		height = 200,
		padding = {top: 10, right: 10, bottom: 10, left: 10};

	
	// geo
	let geo = d3.geoMercator


	// elements
	let elements = [];


	// projection
	let projectionObject;

	// data
	let featureCollection;


	// data functions
	let fn_key = (d, i) => i;


	// generic call function
	let fn_call = selection => {}


	/*** HANDLERS ***/

	// update functions
	let fn_updateProjectionObject;

	let fn_updateFeatureCollection;



	/*** SELF FUNCTION ***/

	function self(selection) {
		selection.each(function(){

			/*** CALCULA ***/

			const extent = [ [ padding.left, padding.top ], [ width - padding.right, height - padding.bottom ] ]

			projectionObject = projectionObject || featureCollection; // defaulting to feature colleciton

			let fn_projection = geo().fitExtent(extent, projectionObject);


			/*** DRAWING ***/

			//	svg
			let svg = d3
				.select(this)
				.append("svg")
				.attr("width", width)
				.attr("height", height)

			svg.call(fn_call)


			//	elements
			elements.forEach(el => {
				el.fn_key(fn_key)
					.fn_projection(fn_projection)
					.featureCollection(featureCollection)

				svg.call(el)
			})

			/*** UPDATES ***/


			fn_updateProjectionObject = function() {

				/*** CALCULA ***/

				fn_projection.fitExtent(extent, projectionObject)

				/*** DRAWING ***/

				elements.forEach(el => {
					el.fn_projection(fn_projection)
				})

			}


			fn_updateFeatureCollection = function() {

				/*** CALCULA ***/

				/*** DRAWING ***/

				elements.forEach(el => {
					el.featureCollection(featureCollection)
				})
				

			}


		})
	}

	/*** GETTERS/SETTERS ***/ 

	// 	view parameters
	self.width = function(value) {
		if (!arguments.length) return width;
		width = value;
		return self;
	};

	self.height = function(value) {
		if (!arguments.length) return height;
		height = value;
		return self;
	};

	self.padding = function(value) {
		if (!arguments.length) return padding;
		padding = value;
		return self;
	};

	// geo
	self.geo = function(value) {
		if (!arguments.length) return geo;
		geo = value;
		return self;
	};

	
	//	elements
	self.pushElement = function(el) {
		elements.push(el)
		return self;
	}

	self.pushElements = function(els) {
		els.forEach(el => self.pushElement(el))
		return self;
	}

	// projection
	self.projectionObject = function(value) {
		if (!arguments.length) return projectionObject;
		projectionObject = value;
		if (typeof fn_updateProjectionObject === "function") 
			fn_updateProjectionObject()
		return self;
	};

	// 	data
	self.featureCollection = function(value) {
		if (!arguments.length) return featureCollection;
		featureCollection = value;
		if (typeof fn_updateFeatureCollection === "function") 
			fn_updateFeatureCollection()
		return self;
	}

	// 	data functions
	self.fn_key = function(value) {
		if (!arguments.length) return fn_key;
		fn_key = value;
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

