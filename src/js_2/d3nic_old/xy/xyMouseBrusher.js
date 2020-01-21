"use strict";

/* 
 *	Brusher...
 */
export function xyMouseBrusher(){

	/*** VARIABLES ***/

	// direction
	let horizontal = true;

	// scales
	let fn_xScale;
	let fn_yScale;

	// data
	let data;

	// data functions
	let fn_key = (d, i) => i;

	// actions

	let fn_onBrushAction = (dataBrush) => {}; // RETURNS THE CHANGES, not all the brushed elements
	let fn_onEndAction = (dataBrush) => {};


	/*** HANDLERS ***/

	// update functions
	let fn_updateData;


	/*** SELF FUNCTION ***/

	function self(selection) {
		
		//const fn_bisect = d3.bisector(fn_key).left;

		// DATA FOR BRUSH
		let dataBrush = data.map((d, i) => { 
			return { d: d, i: i, brushed: true, change: false } 
		})


		let fn_brush = d3.brushX()
		
		fn_brush.extent([
			[fn_xScale.range()[0], fn_yScale.range()[1]], 
			[fn_xScale.range()[1], fn_yScale.range()[0]]
		])

		let gBrush = selection.append("g")
			.classed("brusher", true)
			.call(fn_brush)

		gBrush.selectAll("rect")
			.attr("height", fn_yScale.range()[1] + fn_yScale.range()[0])
			.attr("y", fn_yScale.range()[1])

		gBrush.select("rect.selection")
			.style("fill", "#6a51a3")
			.style("fill-opacity", 0.1)
			.attr("stroke", "")

		let mouseScale = d3.scaleQuantize()
			.domain(fn_xScale.range())
			.range(dataBrush.map((d, i) => i)) // use index to keep information on it

		let halfStep = (mouseScale.thresholds()[1] - mouseScale.thresholds()[0]) / 2

		
		// helpers
		let d0Last = undefined;
		let i0Last = NaN;

		// helpers
		let d1Last = undefined;
		let i1Last = NaN;

		let change = false;

		// mouse handlers

		let fn_onBrush = (d, i, nodes) => {

			//console.log(d3.event.sourceEvent.type + " - " + Math.random())

			if (d3.event.sourceEvent.type !== "mousemove") return; // Only transition after input.

			let extent = d3.brushSelection(nodes[i])

			let i0 = i0Last;
			let i1 = i1Last;

			if ((extent[1] - extent[0]) > halfStep) {

				i0 = mouseScale(extent[0] + halfStep)
				i1 = mouseScale(extent[1] - halfStep)

				let newExtent = [ mouseScale.invertExtent(i0)[0], mouseScale.invertExtent(i1)[1]]
			
				d3.select(nodes[i]).call(fn_brush.move, newExtent)

				
			} else {

				d3.select(nodes[i]).call(fn_brush.move, [0, 0])

				i0 = -1
				i1 = -1

			}

			if(i0 !== i0Last || i1 !== i1Last) {


				for (let j = 0; j < dataBrush.length; j++) {

					// if inside the brushed ones
					if (i0 <= j && j <= i1){
						dataBrush[j].change = !dataBrush[j].brushed // if already brushed, set "change" to false, otherwise true
						dataBrush[j].brushed = true;
					} else {
						dataBrush[j].change = dataBrush[j].brushed // if already UNbrushed, set "change" to false, otherwise true
						dataBrush[j].brushed = false;
					}

				}

				fn_onBrushAction(dataBrush)

				change = true;
				i0Last = i0;
				i1Last = i1;

			}

		}

		let fn_onEnd = (d, i, nodes) => {

			if (d3.event.sourceEvent.type !== "mouseup") return; // Only transition after input.

			let extent = d3.brushSelection(nodes[i])


			if(!extent){

				d3.select(nodes[i]).call(fn_brush.move, [0, 0])

				if ( i0Last !== 0 || i1Last !== (dataBrush.length-1) ) {

					dataBrush.forEach(db => {
						db.change = true;
						db.brushed = true; // I am sure before everything was unbrushed
					})

					fn_onBrushAction(dataBrush)

					i0Last = 0
					i1Last = dataBrush.length - 1 // attention if no data...
					change = true;	

				}

			}

			if (change) {

				fn_onEndAction(dataBrush)

				change = false;

			}

		}

		i0Last = 0
		i1Last = dataBrush.length - 1 // attention if no data...

		fn_brush.on("brush", fn_onBrush)
		fn_brush.on("end", fn_onEnd)



		fn_updateData = function() {

			/*

				HANDLE THIS CASE? attention to current brushes...

			*/

			/*

			mouseScale.domain(fn_xScale.range())
				.range(data.map((d, i) => i))

			halfStep = (mouseScale.thresholds()[1] - mouseScale.thresholds()[0]) / 2

			*/

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
	self.fn_onBrushAction = function(value) {
		if (!arguments.length) return fn_onBrushAction;
		fn_onBrushAction = value;
		return self;
	}

	self.fn_onEndAction = function(value) {
		if (!arguments.length) return fn_onEndAction;
		fn_onEndAction = value;
		return self;
	}

	
	return self;

}