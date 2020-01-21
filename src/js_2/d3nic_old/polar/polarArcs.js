"use strict";

/*
 *	Arcs in a pie
 */
export function polarArcs() {

	let fn_stroke = (d, i) => "white";
	let fn_strokeWidth = (d, i) => 1;
	let fn_fill = (d, i) => "red";

	let fn_fontSize = (d, i) => 14;

	let radiusRange; // if not defined, fn_radiusScale.range() will be used

	let fn_text; // if not defined, no text will be placed


	// scales
	let fn_angleScale,
		fn_radiusScale;

	// data
	let data;


	let fn_key = (d, i) => i;
	let fn_valueArc = (d, i) => d;


	// generic call function
	let fn_call = arcs => {}


	/*** HANDLERS ***/

	// update functions
	let fn_updateData;



	/*** SELF FUNCTION ***/

	function self(selection) {
		selection.each(function(){


			/*** CALCULA ***/

			const radius = fn_radiusScale.range()[1]

			const fn_pie = d3.pie()
				.sort(null)
				.value(fn_valueArc)

			const fn_radiusScaleMod = fn_radiusScale.copy()

			if (radiusRange)
				fn_radiusScaleMod.range(radiusRange)
			
			const innerRadius = fn_radiusScaleMod.range()[0]
			const outerRadius = fn_radiusScaleMod.range()[1]

			const fn_arc = d3.arc()
		    	.innerRadius(innerRadius)
		    	.outerRadius(outerRadius)

			const arcTween = d => {
				const interpolate = d3.interpolate({ startAngle: d.startAngleOld, endAngle: d.endAngleOld }, d);
				return t => fn_arc(interpolate(t))
			}

		    let dataArc = fn_pie(data, fn_key)
		    let dataArcOld = []

		    console.log(dataArc)

		    const RANDOM = Math.round(Math.random() * 10000)


			const tInit = d3.transition().duration(1000)
			const tUpdate = d3.transition().duration(500)

			const tDelayed = d3.transition().duration(500).delay(1000)


			const fn_drawArcs = (arcs, options) => {

				arcs.join(
					enter => enter
						.append("path")
						.attr("id", (d, i) => "arc-" + RANDOM + "-" + fn_key(d.data, i))
						.style("fill", fn_fill)
						.style("stroke", fn_stroke)
						.style("stroke-width", fn_strokeWidth)
						.call(fn_call)
						.each(d => {
							d.startAngleOld = 0
							d.endAngleOld = 0
							d.innerRadius = innerRadius
							d.outerRadius = outerRadius
						})
						.call(enter => enter.transition(options.init ? tInit : tUpdate)
							.attrTween("d", arcTween)),
					update => update
						.each(d => {
							const dOld = dataArcOld.find(dOld => fn_key(dOld.data) === fn_key(d.data))
							d.startAngleOld = dOld.startAngle
							d.endAngleOld = dOld.endAngle
							d.innerRadius = innerRadius
							d.outerRadius = outerRadius
						})
						.call(update => update.transition(tUpdate)
							.attrTween("d", arcTween)
						),
					exit => exit.remove() // todo
				)

			}

			const fn_drawTexts = (texts, options) => {

				texts.join(
					enter => enter
						.append("text")
						.style("opacity", 0)
						.each((d, i, nodes) => {

							const arcId = "#arc-" + RANDOM + "-" + fn_key(d.data, i)
							const datum = d3.select(arcId).datum()

							const outerArc = ( datum.endAngle - datum.startAngle ) * datum.outerRadius
							const innerArc = ( datum.endAngle - datum.startAngle ) * datum.innerRadius
							const depth = datum.outerRadius - datum.innerRadius

							const flip = ( Math.PI/2 < datum.endAngle && datum.endAngle <= Math.PI/2*3 )

							d3.select(nodes[i])
								.attr("dy", flip ? depth + 6 : -6)
								.attr("dominant-baseline", flip ? "hanging" : "baseline")
								.attr("font-size", fn_fontSize)
								.append("textPath")
								.attr("xlink:href", arcId)
								.style("text-anchor","middle")
								.attr("startOffset", flip ? outerArc + depth + innerArc/2 : outerArc/2 )
								.text((d, i) => fn_text(d.data, i))

						})
						.call(enter => enter.transition(tDelayed)
							.style("opacity", 1)),
					update => update, // todo
					exit => exit.remove() // todo
				)

			}

			/*** DRAWING ***/

			const gArcs = d3.select(this)
				.append("g")
				.classed("arcs", true)

			gArcs.selectAll("g")
				.data(dataArc, d => fn_key(d.data))
				.call(fn_drawArcs, { init: true })

			if (fn_text)
				gArcs.selectAll("text")
					.data(dataArc, d => fn_key(d.data))
					.call(fn_drawTexts, { init: true })


			/*** UPDATES ***/

			fn_updateData = function() {

				/*** CALCULA ***/

				dataArcOld = _.cloneDeep(dataArc)
				dataArc = fn_pie(data, fn_key)

				fn_radiusScaleMod.domain(fn_radiusScale.domain())


				/*** DRAWING ***/

				gArcs.selectAll("path")
					.data(dataArc, d => fn_key(d.data))
					.call(fn_drawArcs, { init: false })

			}


		})
	}



	/*** GETTERS/SETTERS ***/ 

	// 	view parameters
	
	self.fn_stroke = function(value) {
		if (!arguments.length) return fn_stroke;
		fn_stroke = value;
		return self;
	}

	self.fn_strokeWidth = function(value) {
		if (!arguments.length) return fn_strokeWidth;
		fn_strokeWidth = value;
		return self;
	}

	self.fn_fill = function(value) {
		if (!arguments.length) return fn_fill;
		fn_fill = value;
		return self;
	}

	self.fn_fontSize = function(value) {
		if (!arguments.length) return fn_fontSize;
		fn_fontSize = value;
		return self;
	}

	self.fn_text = function(value) {
		if (!arguments.length) return fn_text;
		fn_text = value;
		return self;
	}

	self.radiusRange = function(value) {
		if (!arguments.length) return radiusRange;
		radiusRange = value;
		return self;
	}


	// scales
	self.fn_angleScale = function(value) {
		if (!arguments.length) return fn_angleScale;
		fn_angleScale = value;
		return self;
	}

	self.fn_radiusScale = function(value) {
		if (!arguments.length) return fn_radiusScale;
		fn_radiusScale = value;
		return self;
	}


	// 	data
	self.data = function(value) {
		if (!arguments.length) return data;
		data = value;
		if (typeof fn_updateData === "function") fn_updateData()
		return self;
	}

	// 	data functions
	self.fn_key = function(value) {
		if (!arguments.length) return fn_key;
		fn_key = value;
		return self;
	}

	self.fn_valueArc = function(value) {
		if (!arguments.length) return fn_valueArc;
		fn_valueArc = value;
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