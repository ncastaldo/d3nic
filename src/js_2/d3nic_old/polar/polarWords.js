"use strict";

/*
 *	Words (for word cloud)
 */
export function polarWords() {

	/*** VARIABLES ***/

	// view	
	
	let fn_fill = (d, i) => "red"; 
	let fn_opacity = (d, i) => 1; 

	// scales
	let fn_angleScale,
		fn_radiusScale;

	// data
	let data;

	// data functions
	let fn_key = (d, i) => d.word;
	let fn_value = (d, i) => d.count;

	// generic call function
	let fn_call = polarWords => {}


	/*** HANDLERS ***/

	// update functions
	let fn_updateData;



	/*** SELF FUNCTION ***/

	function self(selection) {
		selection.each(function(){

			/*** CALCULA ***/

			const radius = fn_radiusScale.range()[1]

			let init = true;

			let fn_sizeScale = d3.scaleLog()
				.domain(d3.extent(data, fn_value))
				.range([10, 50]) // parametrize

			let layout = d3.layout.cloud()
				.size([radius * 2, radius * 2])
				.words(_.cloneDeep(data))
				.text(fn_key)
				.font("impact")
				.fontSize((d, i) => fn_sizeScale(fn_value(d, i)))
				.padding(1)
				.rotate(() => 0)//(~~(Math.random() * 6) - 3) * 30)
				//.spiral("archimedean")
				.timeInterval(10)
				.on("end", words => fn_draw(words, init) );


			function fn_draw(words, init) {			

				polarWords = gPolarWords
					.selectAll("text")
					.data(words, fn_key)

				const t = d3.transition().duration(500)
				
				polarWords.join(
					enter => enter
						.append("text")
						.style("text-anchor", "middle")			
						.text(d => d.text)		
						.attr("font-size", 1)
						.style("fill", fn_fill)
						.style("cursor", "default")
						.style("opacity", 0)
						.call(fn_call)
						.call(enter => enter.transition(t)	
							.delay((d, i, nodes) => init && nodes.length ? i * (500 / nodes.length) : 0)
							.attr("font-size", d => d.size)
							.attr("transform", d => "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")")
							.style("opacity", 1)),
					update => update
						.call(update => update.transition(t)
							.attr("font-size", d => d.size)
							.attr("transform", d => "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")")),
					exit => exit
						.call(exit => exit.transition(t)
							.style("opacity", 0)
							.attr("font-size", 1)
							.remove())
				)

        	}


			/*** DRAWING ***/

			let gPolarWords = d3.select(this)
				.append("g")
				.classed("words", true)

			layout.start();

			/*** UPDATES ***/

			fn_updateData = function() {

				init = false;

				fn_sizeScale.domain(d3.extent(data, fn_value))

				layout.stop()
					.words(_.cloneDeep(data))
					.start()

				/*** DRAWING ***/

			}

		})
	}


	/*** GETTERS/SETTERS ***/ 

	// view
	self.fn_fill = function(value) {
		if (!arguments.length) return fn_fill;
		fn_fill = value;
		return self;
	}

	self.fn_opacity = function(value) {
		if (!arguments.length) return fn_opacity;
		fn_opacity = value;
		return self;
	}


	// scales
	self.fn_angleScale = function(value) {
		if (!arguments.length) return fn_angleScale;
		fn_angleScale = value;
		return self;
	}

	self.fn_radiusScale = function(value) {
		if (!arguments.length) return fn_radiusScale;
		fn_radiusScale = value;
		return self;
	}


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


