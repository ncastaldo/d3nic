import Component from '../component.js'

export default class GeoRegions extends Component {
	constructor(params = {}) {
		super(params);
	}

	/**
	 *	@override
	 */
	set chart(chart) {
		super.chart = chart;

		let self = this;

		const fn_path = (d, i) => chart.fn_geoPath(self._fn_value(d, i))

		self._fn_draw = (geoRegions, transition) => {

			geoRegions.join(
				enter => enter
					.append("path")
					.attr("d", fn_path)
					.style("stroke", self._fn_stroke)
					.style("stroke-width", self._fn_strokeWidth)
					.style("fill", self._fn_fill)
					.style("opacity", 0)
					.call(self._fn_enter)
					.call(enter => {

						enter.transition(transition)
							.style("opacity", self._fn_opacity)
			
					}),
				update => update
					.call(self._fn_update)
					.call(update => {

						update.transition(transition)
							.attr("d", fn_path)
							.style("stroke", self._fn_stroke)
							.style("stroke-width", self._fn_strokeWidth)
							.style("fill", self._fn_fill)
							.style("opacity", self._fn_opacity)

					
					}),
				exit => exit
					.call(self._fn_exit)
					.call(exit => {
						exit.transition(transition)
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
	draw(transition) {
		super.draw(transition);

		let self = this;

		self._group.classed("geo-regions", true);

		self._group
			.selectAll("path")
			.data(self._chart.data, self._chart.fn_key)
			.call(self._fn_draw, transition);
	}
}
