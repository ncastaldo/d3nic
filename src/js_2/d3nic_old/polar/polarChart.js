"use strict";

/* 
 *	Polar (radius + centroid) chart
 */
export function polarChart(){

	/*** VARIABLES ***/

	// view parameters
	let width = 300,
		height = 200,
		padding = {top: 30, right: 30, bottom: 30, left: 30};


	// scales
	let angleScale = d3.scalePoint
	let radiusScale = d3.scaleLinear


	// elements
	let elements = [];


	// data
	let data = [];

	// data functions
	let fn_data = data => data;
	let fn_key = (d, i) => i;


	// generic call function
	let fn_call = selection => {}


	/*** HANDLERS ***/

	// helper functions
	function getRadiusDomain(data, elements) {

		let radiusDomain = [Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]
		elements.filter(el => el.fn_value)
			.forEach(el => {  
				radiusDomain[0] = d3.min([radiusDomain[0], d3.min(data, el.fn_value())]);
				radiusDomain[1] = d3.max([radiusDomain[1], d3.max(data, el.fn_value())]);
			})
		return radiusDomain;

	}


	// update functions
	let fn_updateData;



	/*** SELF FUNCTION ***/

	function self(selection) {
		selection.each(function(){

			/*** CALCULA ***/

			const radius = Math.min(width - padding.left - padding.right, height - padding.top - padding.right) / 2;
			const centroid = [width + padding.left - padding.right, height + padding.top - padding.bottom].map(n => n/2);

			let halfStep = !data.length || 2 * Math.PI / data.length / 2;

			//	scales
			let fn_angleScale = angleScale()
				.range([halfStep, 2 * Math.PI - halfStep])
				.domain(data.map(fn_key)) // ATTENTION, here considering scalePoint

			let fn_radiusScale = radiusScale()
				.range([0, radius]) // 
				.domain(getRadiusDomain(data, elements))


			/*** DRAWING ***/

			//	svg
			let svg = d3
				.select(this)
				.append("svg")
				.attr("width", width)
				.attr("height", height)

			let gPolar = svg.append("g")
				.classed("polar", true)
				.attr("transform", "translate(" + centroid[0] + ", " + centroid[1] + ")");

			gPolar.call(fn_call)

			//	elements
			elements.forEach(el => {
				el.fn_angleScale(fn_angleScale)
					.fn_radiusScale(fn_radiusScale)
					.fn_key(fn_key)
					.data(data)

				gPolar.call(el)
			})

			/*** UPDATES ***/

			fn_updateData = function() {

				/*** CALCULA ***/

				halfStep = !data.length || 2 * Math.PI / data.length / 2;

				//	scales
				fn_angleScale
					.range([halfStep, 2 * Math.PI - halfStep])
					.domain(data.map(fn_key)) // ATTENTION, here considering scalePoint

				fn_radiusScale.domain(getRadiusDomain(data, elements))

				/*** DRAWING ***/

				//	elements
				elements.forEach(el => {
					el.fn_angleScale(fn_angleScale)
						.fn_radiusScale(fn_radiusScale)
						.data(data)
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

	// scales
	self.angleScale = function(value) {
		if (!arguments.length) return angleScale;
		angleScale = value;
		return self;
	};

	self.radiusScale = function(value) {
		if (!arguments.length) return radiusScale;
		radiusScale = value;
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



	// 	data
	self.data = function(value) {
		if (!arguments.length) return data;
		data = fn_data(value);
		if (typeof fn_updateData === "function") fn_updateData()
		return self;
	}

	// 	data functions
	self.fn_data = function(value) {
		if (!arguments.length) return fn_data;
		fn_data = value;
		return self;
	}

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

