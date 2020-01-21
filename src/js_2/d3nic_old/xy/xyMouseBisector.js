"use strict";

/* 
 *	Bisector...
 */
export function xyMouseBisector(){

	/*** VARIABLES ***/
	
	// direction
	let horizontal = true;

	// scales
	let fn_xScale,
		fn_yScale;

	// data
	let data;

	// data functions
	let fn_key = (d, i) => i;


	// actions
	let fn_onMouseenterAction = () => {};
	let fn_onMouseoverAction = (d, i) => {};
	let fn_onMouseoutAction = (d, i) => {};
	let fn_onMouseleaveAction = () => {};

	/*** HANDLERS ***/

	// update functions
	let fn_updateData;


	/*** SELF FUNCTION ***/

	function self(selection) {

		const x0 = fn_xScale.range()[0]
		const x1 = fn_xScale.range()[1]

		const y0 = fn_yScale.range()[1] // reversed
		const y1 = fn_yScale.range()[0]


		// ADJUSTING THE STEP for lines/areas... put flag in case of bars...
		
		let step = Math.abs((x0 - x1) / data.length) // what if 0?

		let domain = [ x0 - step/2, x1 + step/2 ] // if negative?

		let mouseScale = d3.scaleQuantize()
			.domain(domain)
			.range(data.map((d, i) => i)) // use index to keep information on it


		// helpers
		let dLast;
		let iLast = NaN;

		let inside = false;

		// mouse handlers

		const fn_onMousemove = (d, i, nodes) => {
			
			const x = d3.mouse(nodes[i])[0]
			const y = d3.mouse(nodes[i])[1]

			if (x0 <= x && x <= x1 && y0 <= y && y <= y1) {

				if (!inside) {
					fn_onMouseenterAction() // ENTERING
					inside = true;
				}


				const i = mouseScale(x)
				const d = data[i]


				if (iLast !== i){

					if ( !isNaN(iLast) ) {
						fn_onMouseoutAction(dLast, iLast)
					}

					fn_onMouseoverAction(d, i)

					dLast = d;
					iLast = i;
				}

			} else {

				if (inside) {

					if ( !isNaN(iLast) ) {
						fn_onMouseoutAction(dLast, iLast)
						iLast = NaN
					}

					fn_onMouseleaveAction() // LEAVING
					inside = false;
				
				}
			
			}

		}


		const fn_onMouseleave = () => {

			if (inside) {

				if ( !isNaN(iLast) ) {
					fn_onMouseoutAction(dLast, iLast)
					iLast = NaN
				}

				fn_onMouseleaveAction() // LEAVING
				inside = false;
			
			}
		
		}

		selection.on("mousemove.mouse-bisector", fn_onMousemove)
		selection.on("mouseleave.mouse-bisector", fn_onMouseleave)

		fn_updateData = function() {

			step = (fn_xScale.range()[1] - fn_xScale.range()[0]) / data.length // what if 0?
			domain = [ 
				fn_xScale.range()[0] - step/2, // what if negative?
				fn_xScale.range()[1] + step/2
			]

			mouseScale.domain(domain)
				.range(data.map((d, i) => i))

		}

	}

	// direction
	self.horizontal = function(value) {
		if (!arguments.length) return horizontal;
		horizontal = value;
		return self;
	};

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