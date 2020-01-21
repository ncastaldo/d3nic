"use strict";

/*
 *
 *	Bar Brusher
 *
 */
export function barBrusher() {

	let width = 200,
		height = 100,
		x = 5,
		y = 5;

	let barsInfo;

	let fn_brushingCallback = (keysExtent) => {}
	let fn_brushEndCallback = (keysExtent) => {}

	let fn_updateWidth;


	function element(selection) {
		selection.each(function() {

			//https://stackoverflow.com/questions/42781226/d3-js-v3-to-v4-brush-changes
			let fn_brush = d3.brushX()
			fn_brush.extent([[x, y], [x + width, y + height]])

			let gBrush = d3.select(this)
				.append("g")
				.classed("brusher", true)
				.call(fn_brush)

			gBrush.selectAll("rect")
				.attr("height", height)
				.attr("y", y)

			gBrush.select("rect.selection")
				.style("fill", "lightblue")
				.style("fill-opacity", 0.2)
				.attr("stroke", "")

			let keysExtent = d3.extent(barsInfo, bi => bi.key)
			let something = false;

			function fn_brushing() {

				if (!d3.event.sourceEvent) return; // Only transition after input.

				something = false;

			  	if (d3.event.selection) {
			  		
					let extent = d3.brushSelection(gBrush.node())
					let e0 = extent[0]
					let e1 = extent[1]

					let eMin = Number.POSITIVE_INFINITY;
					let eMax = Number.NEGATIVE_INFINITY;

					let keyMin = keysExtent[0]
					let keyMax = keysExtent[1]



					for(let i in barsInfo){
						if ( e0 <= barsInfo[i].center && barsInfo[i].center <= e1 ){ 

							barsInfo[i].bars.forEach(b => b.dispatch("brushed"))
							something = true;

							if(barsInfo[i].extent[0] < eMin){
								eMin = barsInfo[i].extent[0]
								keyMin = barsInfo[i].key
							}

							if(eMax < barsInfo[i].extent[1]){
								eMax = barsInfo[i].extent[1]
								keyMax = barsInfo[i].key
							}

						} else {
							barsInfo[i].bars.forEach(b => b.dispatch("unbrushed"))
						}
					}

					if(something && (eMin!=e0 || eMax!=e1))
						gBrush.call(fn_brush.move, [ eMin, eMax ])

					if(keyMin !== keysExtent[0] || keyMax !== keysExtent[1]){
						keysExtent = [ keyMin, keyMax ]
						fn_brushingCallback(keysExtent)
					}
					
					
					if(!something)
						gBrush.call(fn_brush.move, [0, 0])
				
				} else {

					barsInfo.map(bi => bi.bars.forEach(b => b.dispatch("unbrushed"))) // all unbrushed

				}

			}

			function fn_brushEnd() {

				if(!d3.event.selection){
					barsInfo.map(bi => bi.bars.forEach(b => b.dispatch("brushed"))) // all brushed
					keysExtent = d3.extent(barsInfo, bi => bi.key)
					something = false;
				}

				fn_brushEndCallback(keysExtent)

			}

			fn_brush.on("brush", fn_brushing)
			fn_brush.on("end", fn_brushEnd)

			fn_updateWidth = () => {

				fn_brush.extent([[x, y], [x + width, y + height]])

				gBrush.call(fn_brush)

				if(something){

					let e0move = barsInfo.find(bi => bi.key === keysExtent[0]).extent[0]
					let e1move = barsInfo.find(bi => bi.key === keysExtent[1]).extent[1]

					gBrush.call(fn_brush.move, [ e0move, e1move ])
				}

				
			}
		
		})
 	}

 	element.width = function(value) {
 		if (!arguments.length) { return width; }
 		width = value;
 		if (typeof fn_updateWidth === "function") fn_updateWidth()
 		return element;
 	}

 	element.height = function(value) {
 		if (!arguments.length) { return height; }
 		height = value;
 		return element;
 	}

 	element.x = function(value) {
 		if (!arguments.length) { return x; }
 		x = value;
 		return element;
 	}

 	element.y = function(value) {
 		if (!arguments.length) { return y; }
 		y = value;
 		return element;
 	}

 	element.barsInfo = function(value) {
 		if (!arguments.length) { return barsInfo; }
 		barsInfo = value;
 		return element;
 	}

 	element.fn_brushingCallback = function(value) {
 		if (!arguments.length) { return fn_brushingCallback; }
 		fn_brushingCallback = value;
 		return element;
 	}

 	element.fn_brushEndCallback = function(value) {
 		if (!arguments.length) { return fn_brushEndCallback; }
 		fn_brushEndCallback = value;
 		return element;
 	}

 	return element;

}
