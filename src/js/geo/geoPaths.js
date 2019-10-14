import Component from '../component.js'

export default class GeoPath extends Component {
	constructor(params = {}) {
		super(params);
	}

	/**
	 *	@override
	 */
	set chart(chart) {
		super.chart = chart;

		let self = this;
		self._fn_draw = (geoPaths, options) => {

			const t = d3.transition().duration(options.duration)

			geoPaths.join(
				enter => enter
					.append("path")
					.attr("d", chart.fn_geoPath)
					.style("stroke", self._fn_stroke)
					.style("stroke-width", self._fn_strokeWidth)
					.style("fill", self._fn_fill)
					.style("opacity", 0)
					.call(self._fn_enter)
					.call(enter => {

						enter.transition(t)
							.style("opacity", self._fn_opacity)
			
					}),
				update => update
					.call(update => {

						update.transition(t)
							.attr("d", chart.fn_geoPath)
							.style("stroke", self._fn_stroke)
							.style("stroke-width", self._fn_strokeWidth)
							.style("fill", self._fn_fill)
							.style("opacity", self._fn_opacity)

					
					}),
				exit => exit
					.call(exit => {
						exit.transition(t)
							.style("opacity", 0)
							.remove()
					}),
			)

		};

		return self;
	}

	/**
	 *	@override
	 */
	draw(options) {
		super.draw(options);

		let self = this;

		self._group.classed("geo-paths", true);

		self._group
			.selectAll("path")
			.data(self._chart.data, self._chart.fn_key)
			.call(self._fn_draw, options);
	}
}
