"use strict";

/* 
 *	Tooltip
 */
export function tooltip(){

	/*** VARIABLES ***/

	let backgroundColor = "rgba(232, 232, 232, 1)"
	let border = "3px solid #cccccc"

	let fn_text = (d, i) => d
	let fn_color = (d, i) => "gray"
	let fn_fontSize = 10;
	let fn_fontWeight = "normal";

	let data = [];

	let fn_call = tooltip => {}


	/*** HANDLERS ***/

	let fn_updateData;


	/*** SELF FUNCTION ***/

	function self(selection) {

		const FLEX_WIDTH = 80
		const FLEX_HEIGHT = 100
		const DISTANCE = 50

		const width = selection.attr("width")
		const height = selection.attr("height")

		const foreignObject = selection.append("foreignObject")
			.attr("width", width)
			.attr("height", height)
			.style("pointer-events", "none")

		const body = foreignObject.append("xhtml:body")
			.style("background-color", "transparent")

		const tooltip = body.append("div")
			.style("opacity", 0)
			.style("position", "absolute")
			.style("display", "flex")
			.style("flex-wrap", "wrap")
			.style("justify-content", "center")
			//.style("align-items", "center")
			.style("flex-direction", "column")
			.style("background-color", backgroundColor)
			.style("border", border)
			.style("padding", "6px")


		// mouse handlers

		const fn_onMousemove = (d, i, nodes) => {

			const x = d3.mouse(nodes[i])[0]
			const y = d3.mouse(nodes[i])[1]

			foreignObject.moveToFront()

			/* CALCULA to place tooltip 

			const left = x > width/2
			const bottom = y > height/2

			const cat1 = left ? x : width - x
			const cat2 = bottom ? y : height - y
			const hyp = Math.sqrt(Math.pow(cat1, 2) + Math.pow(cat2, 2))

			left ---> +(x - FLEX_WIDTH/2 + DISTANCE) + "px")//+((left ? -1 : +1) * (hyp ? DISTANCE / hyp * cat1 : 0))) + "px")
			top  ---> +(y - FLEX_HEIGHT/2 ) + "px")//+((bottom ? -1 : +1) * (hyp ? DISTANCE / hyp * cat2 : 0))) + "px")

			*/

			const xPad = 20;
			const yPad = 0;

			const w = tooltip.node().offsetWidth
			const h = tooltip.node().offsetHeight

			//const xNew = w + xPad + x <= width ? x + xPad : width - w // CORNER
			const xNew = x + w + xPad <= width ? x + xPad : x - w - xPad;
			const yNew = h + yPad <= y ? y - yPad - h : 0;

			tooltip.style("left", Math.round(xNew) + "px" )
				.style("top", Math.round(yNew) + "px")

		} 


		const fn_draw = tooltip => {

			tooltip.join(
				enter => enter
					.append("div")
					.text(fn_text)
					.style("color", fn_color)
					.style("font-size", fn_fontSize)
					.style("font-weight", fn_fontWeight)
					.style("white-space","nowrap"),
				update => update
					.text(fn_text)
					.style("color", fn_color)
					.style("font-size", fn_fontSize)
					.style("font-weight", fn_fontWeight),
				exit => exit
					//.remove()
			)

		}

		/*		
			tooltip.append("div")
			.style("background-color", "purple")
			.text("Uh")
			.style("color", "yellow")*/


		selection.on("mousemove.tooltip",  fn_onMousemove)

		tooltip.call(fn_call)

		tooltip.selectAll("div")
			.data(data)
			.call(fn_draw)

		
		/*** UPDATES ***/

		fn_updateData = function() {

			/*** DRAWING ***/

			// area
			tooltip.selectAll("div")
				.data(data)
				.call(fn_draw)

		}

	}

	// variables

	self.backgroundColor = function(value) {
		if (!arguments.length) return backgroundColor;
		backgroundColor = value;
		return self;
	}

	self.fn_text = function(value) {
		if (!arguments.length) return fn_text;
		fn_text = value;
		return self;
	}

	self.fn_color = function(value) {
		if (!arguments.length) return fn_color;
		fn_color = value;
		return self;
	}

	self.fn_fontSize = function(value) {
		if (!arguments.length) return fn_fontSize;
		fn_fontSize = value;
		return self;
	}

	self.fn_fontWeight = function(value) {
		if (!arguments.length) return fn_fontWeight;
		fn_fontWeight = value;
		return self;
	}

	// data
	self.data = function(value) {
		if (!arguments.length) return data;
		data = value;
		if (typeof fn_updateData === "function") fn_updateData()
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