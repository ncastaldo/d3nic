"use strict";

/*
 *	Tooltips
 */
export function xyTooltips() {

	/*** VARIABLES ***/

	// direction
	let horizontal = true;

	// view	
	let backgroundColor = "rgba(232, 232, 232, 0.95)"
	let border = "2px solid #cccccc"
	
	let padding = 6
	let distance = 6

	let fn_opacity = (d, i) => 0; 

	// scales
	let fn_xScale,
		fn_yScale;



	// objects
	let fn_html = (d, i) => ""


	// data
	let data;

	// data functions
	let fn_key = (d, i) => i;
	let fn_defined = (d, i) => true

	// generic call function
	let fn_call = xyTooltips => {}


	/*** HANDLERS ***/

	// update functions
	let fn_updateData;



	/*** SELF FUNCTION ***/

	function self(selection) {
		selection.each(function(){

			/*** CALCULA ***/

			const width = fn_xScale.range()[1] - fn_xScale.range()[0]
			const height = fn_yScale.range()[0] - fn_yScale.range()[1]
			const x = fn_xScale.range()[0] 
			const y = fn_yScale.range()[1]

			const xCenter = d3.mean(fn_xScale.range())

			let fn_draw = (tooltips, options) => {

				const t = d3.transition().duration(500)

				tooltips.join(
					enter => enter
						.append("div")
						.classed("tooltip", true)
						.style("position", "absolute")
						.style("top", fn_yScale.range()[1] + "px")
						.style("background-color", backgroundColor)
						.style("border", border)
						.style("padding", padding + "px")
						.style("opacity", fn_opacity)
						.html(fn_html)
						.call(fn_call),					
					update => update
						.html(fn_html),						
					exit => exit
						.remove())
				.each((d, i, nodes) => {
					const xCur = fn_xScale(fn_key(d, i))
					const onRight = xCur < xCenter
					d3.select(nodes[i])
						.style("left", onRight ? + (xCur + distance - fn_xScale.range()[0]) + "px" : null)
						.style("right", onRight ? null : + (fn_xScale.range()[1] - xCur + distance) + "px")
				})

			}


			/*** DRAWING ***/

			const body = selection.append("foreignObject")
				.attr("width", width) 
				.attr("height", height)
				.attr("transform", "translate(" + x + ", " + y + ")")
				.style("pointer-events", "none")
				.append("xhtml:body")
				.style("background-color", "transparent")
				.classed("tooltips", true)

			console.log(fn_key)

			body.selectAll("div")
				.data(data.filter(fn_defined), fn_key)
				.call(fn_draw, { init: true })
				

			/*** UPDATES ***/

			fn_updateData = function() {

				/*** DRAWING ***/

				body.selectAll("div.tooltip") // TODO
					.data(data.filter(fn_defined), fn_key)
					.call(fn_draw, { init: false })

			}

		})
	}


	/*** GETTERS/SETTERS ***/ 

	// direction
	self.horizontal = function(value) {
		if (!arguments.length) return horizontal;
		horizontal = value;
		return self;
	};

	// view

	self.backgroundColor = function(value) {
		if (!arguments.length) return backgroundColor;
		backgroundColor = value;
		return self;
	}


	self.fn_opacity = function(value) {
		if (!arguments.length) return fn_opacity;
		fn_opacity = value;
		return self;
	}

	
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


	//	html
	self.fn_html = function(value) {
		if (!arguments.length) return fn_html;
		fn_html = value;
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

	self.fn_defined = function(value) {
		if (!arguments.length) return fn_defined;
		fn_defined = value;
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


