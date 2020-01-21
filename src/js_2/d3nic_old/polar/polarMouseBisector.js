"use strict";

/* 
 *	Bisector...
 */
export function polarMouseBisector(){

	/*** VARIABLES ***/

	let radiusRange; // if not defined, fn_radiusScale.range() will be used

	// scales
	let fn_angleScale,
		fn_radiusScale;

	// data
	let data;

	// data functions
	let fn_key = (d, i) => i;


	// actions
	let fn_onMouseenterAction = (d, i) => {};
	let fn_onMouseoverAction = (d, i) => {};
	let fn_onMouseoutAction = (d, i) => {};
	let fn_onMouseleaveAction = (d, i) => {};

	/*** HANDLERS ***/

	// update functions
	let fn_updateData;


	/*** SELF FUNCTION ***/

	function self(selection) {

		// ADJUSTING THE STEP for lines/areas... put flag in case of bars...

		const fn_radiusScaleMod = fn_radiusScale.copy()

		if (radiusRange)
			fn_radiusScaleMod.range(radiusRange)
		
		let step = (fn_angleScale.range()[1] - fn_angleScale.range()[0]) / data.length // what if 0?

		let domain = [0, 2*Math.PI]


		let mouseScale = d3.scaleQuantize()
			.domain(domain)
			.range(data.map((d, i) => i)) // use index to keep information on it


		// helpers
		let dLast;
		let iLast = NaN;

		// mouse handlers

		const fn_onMouseenter = () => {

			fn_onMouseenterAction()

		}

		const fn_onMousemove = (d, i, nodes) => {
			
			const mouse = d3.mouse(nodes[i])

			const x = mouse[0]
			const y = mouse[1]

			let angle = Math.atan(Math.abs(x)/ Math.abs(y)) 
			let radius = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))

			angle = x > 0 ?
				y < 0 ?
					angle : // 1st quarter
					Math.PI - angle // 2nd quarter
				: y >= 0 ?
					angle + Math.PI : // 3rd quarter
					2 * Math.PI - angle // 4rd quarter


			if (mouseScale.domain()[0] <= angle && angle <= mouseScale.domain()[1]) {
				const i = mouseScale(angle)
				const d = data[i]

				if (iLast !== i){

					if ( !isNaN(iLast) ) {
						fn_onMouseoutAction(dLast, iLast)
					}

					fn_onMouseoverAction(d, i)

					dLast = d;
					iLast = i;
				}
			}

		}


		const fn_onMouseleave = () => {

			if ( !isNaN(iLast) ) {
				fn_onMouseoutAction(dLast, iLast)
			}

			fn_onMouseleaveAction()

			iLast = NaN;
		
		}


		selection.append("clipPath")
			.classed("unmask", true)
			.attr("id", "clip-path-inner-circle")
			.append("circle")
			.style("pointer-events", "none")
			.attr("cx", 0)
			.attr("cy", 0)
			.attr("r", +fn_radiusScaleMod.range()[0])


		selection.append("circle")
			.classed("mask", true) // mask to enable mouse events 
			.attr("cx", 0)
			.attr("cy", 0)
			.attr("r", +fn_radiusScaleMod.range()[1])
			.attr("clip-path", "url(#clip-path-inner-circle)")
			.style("opacity", 0)

		selection.on("mouseenter.mouse-bisector", fn_onMouseenter)
		selection.on("mousemove.mouse-bisector", fn_onMousemove)
		selection.on("mouseleave.mouse-bisector", fn_onMouseleave)

		fn_updateData = function() {
/*
			step = (fn_xScale.range()[1] - fn_xScale.range()[0]) / data.length // what if 0?
			domain = [ 
				fn_xScale.range()[0] - step/2, // what if negative?
				fn_xScale.range()[1] + step/2
			]

			mouseScale.domain(domain)
				.range(data.map((d, i) => i))
*/
		}

	}

	self.radiusRange = function(value) {
		if (!arguments.length) return radiusRange;
		radiusRange = value;
		return self;
	}

	// scales
	self.fn_angleScale = function(value) {
		if (!arguments.length) return fn_angleScale;
		fn_angleScale = value;
		return self;
	};

	self.fn_radiusScale = function(value) {
		if (!arguments.length) return fn_radiusScale;
		fn_radiusScale = value;
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


	// actions
	self.fn_onMouseenterAction = function(value) {
		if (!arguments.length) return fn_onMouseenterAction;
		fn_onMouseenterAction = value;
		return self;
	}

	self.fn_onMouseoverAction = function(value) {
		if (!arguments.length) return fn_onMouseoverAction;
		fn_onMouseoverAction = value;
		return self;
	}

	self.fn_onMouseoutAction = function(value) {
		if (!arguments.length) return fn_onMouseoutAction;
		fn_onMouseoutAction = value;
		return self;
	}

	self.fn_onMouseleaveAction = function(value) {
		if (!arguments.length) return fn_onMouseleaveAction;
		fn_onMouseleaveAction = value;
		return self;
	}

	return self;

}