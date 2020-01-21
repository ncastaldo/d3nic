"use strict";

/*
 *	Sectors in a pie
 */
export function polarSectors() {

	let fn_stroke = (d, i) => "white";
	let fn_strokeWidth = (d, i) => 1;
	let fn_fill = (d, i) => "red";
	let fn_fillOpacity = (d, i) => 1;

	let fn_fontSize = (d, i) => 14;

	let radiusRange; // if not defined, fn_radiusScale.range() will be used

	let fn_text; // if not defined, no text will be placed


	// scales
	let fn_angleScale,
		fn_radiusScale;

	// data
	let data;


	let fn_key = (d, i) => i;
	let fn_value = (d, i) => d;


	// generic call function
	let fn_call = sectors => {}


	/*** HANDLERS ***/

	// update functions
	let fn_updateData;



	/*** SELF FUNCTION ***/

	function self(selection) {
		selection.each(function(){


			/*** CALCULA ***/

			const fn_pie = d3.pie()
				.sort(null)
				.value(1) // all equal

			const fn_radiusScaleMod = fn_radiusScale.copy()

			if (radiusRange)
				fn_radiusScaleMod.range(radiusRange)
			
			const innerRadius = fn_radiusScaleMod.range()[0]
			const outerRadius = fn_radiusScaleMod.range()[1]


			const fn_sector = d3.arc()
				.innerRadius(innerRadius)

			const sectorTween = d => {
				const interpolate = d3.interpolate({ outerRadius: d.outerRadiusOld }, d);
				return t => fn_sector(interpolate(t))
			}

		    let dataSector = fn_pie(data, fn_key)
		    let dataSectorOld = []


		    const fn_drawSectors = (sectors, options) => {

				const tInit = d3.transition().duration(1000)
				const tUpdate = d3.transition().duration(500)

				sectors.join(
					enter => enter
						.append("path")
						//.attr("id", (d, i) => "arc-" + RANDOM + "-" + fn_key(d.data, i))
						.style("fill", fn_fill)
						.style("fill-opacity", fn_fillOpacity)
						.style("stroke", fn_stroke)
						.style("stroke-width", fn_strokeWidth)
						.call(fn_call)
						.each(d => { 
							d.innerRadius = innerRadius
							d.outerRadiusOld = innerRadius
							d.outerRadius = fn_radiusScaleMod(fn_value(d.data, d.index)) + 0.001 // TWEAK to avoid dragons.......
						})
						.call(arcs => arcs.transition(options.init ? tInit : tUpdate)
							.attrTween("d", sectorTween)),
					update => update
						.each(d => { 
							const dOld = dataSectorOld.find(dOld => fn_key(dOld.data) === fn_key(d.data))
							d.innerRadius = innerRadius
							d.outerRadiusOld = dOld.outerRadius
							d.outerRadius = fn_radiusScaleMod(fn_value(d.data, d.index)) + 0.001 // TWEAK to avoid dragons.......
						})
						.call(update => update.transition(tUpdate)
							.attr("d", fn_sector)
						),
					exit => exit.remove() // todo
				)

			}




		   	/*** DRAWING ***/

			const gArcs = d3.select(this)
				.append("g")
				.classed("sectors", true)

			gArcs.selectAll("path")
				.data(dataSector, d => fn_key(d.data))
				.call(fn_drawSectors, { init: true })



			/*** UPDATES ***/

			fn_updateData = function() {

				/*** CALCULA ***/

				dataSectorOld = _.cloneDeep(dataSector)
				dataSector = fn_pie(data, fn_key)

				fn_radiusScaleMod.domain(fn_radiusScale.domain())

				/*** DRAWING ***/

				gArcs.selectAll("path")
					.data(dataSector, d => fn_key(d.data))
					.call(fn_drawSectors, { init: false })

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

	self.fn_fillOpacity = function(value) {
		if (!arguments.length) return fn_fillOpacity;
		fn_fillOpacity = value;
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

	self.fn_value = function(value) {
		if (!arguments.length) return fn_value;
		fn_value = value;
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