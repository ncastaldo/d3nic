/*
 *
 *	Mouse line.
 *
 */
 export function mouseLine(_svg){

 	let svg = _svg;

 	let y0,
 		y1;

 	let fn_key = (d, i) => i;
 	let values = ["value"];

 	let fn_xScale,
 		fn_yScale,
 		fn_color;

 	let gMouseLine;

 	function element(selection, i) {
 		selection.on("mouseover.mouse-line", d => {

 			svg.selectAll("g.mouse-line").remove()

			gMouseLine = svg
				.append("g")
				.classed("mouse-line", true)
				.style("pointer-events", "none");

			gMouseLine.append("path")
				.attr("d", () => "M0," + y0 + " 0," + y1)
				.style("stroke-dasharray", "2,2")
				.style("stroke-width", 1)
				.style("stroke", "black")

			gMouseLine.selectAll("circle")
				.data(values)
				.enter()
				.append("circle")
				.attr("cx", 0)
				.attr("cy", (v, j) => fn_yScale(Object.byString(d, v), i))
				.attr("r", 3)
				.style("fill", (v, j) => fn_color(v, j, d, i))
				.style("stroke-width", 1)
				.style("stroke", "black");

			gMouseLine.attr(
				"transform",
				"translate(" + fn_xScale(fn_key(d, i)) + ", 0)"
			);

		})
		.on("mouseout.mouse-line remove change", () => {
			if(gMouseLine) gMouseLine.remove()
		})
 	}

 	element.svg = function(value) {
 		if (!arguments.length) return svg;
 		svg = value;
 		return element
 	}

 	element.y0 = function(value) {
 		if (!arguments.length) return y0;
 		y0 = value;
 		return element
 	}

 	element.y1 = function(value) {
 		if (!arguments.length) return y1;
 		y1 = value;
 		return element
 	}

 	element.fn_key = function(value) {
 		if (!arguments.length) return fn_key;
 		fn_key = value;
 		return element
 	}

 	element.values = function(value) {
 		if (!arguments.length) return values;
 		values = value;
 		return element
 	}

 	element.fn_xScale = function(value) {
 		if (!arguments.length) return fn_xScale;
 		fn_xScale = value;
 		return element
 	}

 	element.fn_yScale = function(value) {
 		if (!arguments.length) return fn_yScale;
 		fn_yScale = value;
 		return element
 	}

 	element.fn_color = function(value) {
 		if (!arguments.length) return fn_color;
 		fn_color = value;
 		return element
 	}

 	return element;

 }
