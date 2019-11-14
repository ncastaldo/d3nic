import * as d3 from '@/js/d3-modules.js';
import Component from '@/js/component.js'

export default class GeoRegions extends Component {
	constructor(params = {}) {
		super(params);

		let self = this;

		self._fn_value = params.fn_value || ((d, i) => d)

		self._fn_valueDomain = (data) => data.filter(self._fn_defined).map(d => self._fn_value(d))
	}

	/**
	 *	@override
	 */
	set chart(chart) {
		super.chart = chart;

		let self = this;

		const fn_geoPath = d3.geoPath().projection(chart.fn_geoProjection)
		const fn_path = (d, i) => fn_geoPath(self._fn_value(d, i))

		self._fn_draw = (geoRegions, transition) => {

			self._join = geoRegions.join(
				enter => enter
					.append("path")
					.attr("stroke", self._fn_stroke)
					.attr("stroke-width", self._fn_strokeWidth)
					.attr("fill", self._fn_fill)
					.attr("fill-opacity", self._fn_fillOpacity)
					.attr("opacity", 0)
					.call(self._fn_enter)
					.call(enter => {

						enter.transition(transition)
							.attr("d", fn_path)
							.attr("opacity", self._fn_opacity)
			
					}),
				update => update
					.call(self._fn_update)
					.call(update => {

						update.transition(transition)
							.attr("d", fn_path)
							.attr("stroke", self._fn_stroke)
							.attr("stroke-width", self._fn_strokeWidth)
							.attr("fill", self._fn_fill)
							.attr("opacity", self._fn_opacity)

					
					}),
				exit => exit
					.call(self._fn_exit)
					.call(exit => {
						exit.transition(transition)
							.attr("d", fn_path)
							.attr("opacity", 0)
							.remove()
					}),
			)

		};

	}
	
	/**
	 *	@override
	 */
	drawCanvas(transition){
		/*super.drawCanvas(context)

		let self = this;

		// clearing canvas
		//context.fillStyle = '#fff';
		//context.fillRect(0, 0, chart.size.width, chart.size.height);

		//context.lineJoin = "round";
		//context.lineCap = "round";
		
		self._join.each((d, i, nodes) => {
			const selection = d3.select(nodes[i]) 

			const path = new Path2D(selection.attr("d"))
			context.fillStyle = selection.attr("fill")
			context.lineWidth = selection.attr("stroke-width")
			context.strokeStyle = selection.attr("stroke")

			context.beginPath()
			context.fill(path)
			context.stroke(path)
			context.closePath()
		})*/

	}

	/**
	 *	@override
	 */
	draw(transition) {
		super.draw(transition);

		let self = this;

		self._group.classed("geo-regions", true);

		self._group
			.selectAll("path")
			.data(self._chart.data.filter(self._fn_defined), self._chart.fn_key)
			.call(self._fn_draw, transition);

	}
}
