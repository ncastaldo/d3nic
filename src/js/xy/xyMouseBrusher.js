import Component from '../component.js'

export default class XyMouseBrusher extends Component {
	constructor(params = {}) {
		super(params);

		let self = this;

		self._brushFill = params.brushFill || d3.schemeBlues[5][3];
		self._brushFillOpacity = params.brushFillOpacity || 0.1;

		self._fn_onBrushAction = params.fn_onBrushAction || (dataBrush => {});
		self._fn_onEndAction = params.fn_onEndAction || (dataBrush => {});

	}

	/**
	 *	@override
	 */
	set chart(chart) {
		super.chart = chart;

		let self = this;

		const mouseScale = d3.scaleQuantize()

		const fn_brush = d3.brushX()

		self._fn_draw = (brush, transition) => {

			const dataBrush = chart.data.map((d, i) => { 
				return { d: d, i: i, brushed: true, change: false } 
			})

			mouseScale.domain(chart.fn_xScale.range())
				.range(chart.data.length ? 
					chart.data.map((d, i) => i) :  // use index to keep information on it
					[0])

			const halfStep = (mouseScale.thresholds()[1] - mouseScale.thresholds()[0]) / 2


			
			// helpers
			let d0Last = undefined;
			let i0Last = NaN;

			// helpers
			let d1Last = undefined;
			let i1Last = NaN;

			let change = false;

			const fn_onBrush = (d, i, nodes) => {

				//console.log(d3.event.sourceEvent.type + " - " + Math.random())

				if (d3.event.sourceEvent.type !== "mousemove") return; // Only transition after input.

				const extent = d3.brushSelection(nodes[i])

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

					self._fn_onBrushAction(dataBrush)

					change = true;
					i0Last = i0;
					i1Last = i1;

				}

			}

			const fn_onEnd = (d, i, nodes) => {

				if (d3.event.sourceEvent.type !== "mouseup") return; // Only transition after input.

				const extent = d3.brushSelection(nodes[i])

				if(!extent){

					d3.select(nodes[i]).call(fn_brush.move, [0, 0])

					if ( i0Last !== 0 || i1Last !== (dataBrush.length-1) ) {

						dataBrush.forEach(db => {
							db.change = true;
							db.brushed = true; // I am sure before everything was unbrushed
						})

						self._fn_onBrushAction(dataBrush)

						i0Last = 0
						i1Last = dataBrush.length - 1 // attention if no data...
						change = true;	

					}

				}

				if (change) {

					self._fn_onEndAction(dataBrush)

					change = false;

				}

			}

			i0Last = 0
			i1Last = dataBrush.length - 1 // attention if no data...



			fn_brush.on("brush", fn_onBrush)
			fn_brush.on("end", fn_onEnd)

			fn_brush.extent([
				[chart.fn_xScale.range()[0], chart.fn_yScale.range()[1]], 
				[chart.fn_xScale.range()[1], chart.fn_yScale.range()[0]]
			])

			brush.call(fn_brush)

			brush.selectAll("rect")
				.attr("height", chart.fn_yScale.range()[1] + chart.fn_yScale.range()[0])
				.attr("y", chart.fn_yScale.range()[1])

			brush.select("rect.selection")
				.attr("fill", self._brushFill)
				.attr("fill-opacity", self._brushFillOpacity)
				.attr("stroke", "")


		}
		
	}

	/**
	 *	@override
	 */
	draw(transition) {
		super.draw(transition);

		let self = this;

		self._group.classed("xy-mouse-brusher", true)

		self._group.call(self._fn_draw, transition)

	}
}
