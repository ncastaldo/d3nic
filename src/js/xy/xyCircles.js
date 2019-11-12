import * as d3 from '@/js/d3-modules.js';
import Component from '@/js/component.js'

export default class XyCircles extends Component {
	constructor(params = {}) {
		super(params);

		let self = this;

		self._fn_radius = params.fn_radius || ((d, i) => 3);

		self._fn_value = params.fn_value || ((d, i) => d)

		self._fn_valueDomain = (data) => d3.extent(data, self._fn_value)

	}

	/**
	 *	@override
	 */
	set chart(chart) {
		super.chart = chart;

		let self = this;

		const fn_cx = (d, i) => chart.fn_xScale(chart.fn_key(d, i))
		const fn_cy = (d, i) => chart.fn_yScale(self._fn_value(d, i))

		self._fn_draw = (circles, transition) => {

			self._join = circles.join(
				enter =>
					enter
						.append("circle")
						.attr("cx", fn_cx)
						.attr("cy", fn_cy)
						.attr("stroke", self._fn_stroke)
						.attr("stroke-width", self._fn_strokeWidth)
						.attr("fill", self._fn_fill)
						.attr("opacity", self._fn_opacity)
						.attr("r", 0)
						.call(self._fn_enter)
						.call(enter => {
							enter.transition(transition)
								.attr("r", self._fn_radius)
						}),
				update =>
					update.call(update =>
						update
							.transition(transition)
							.attr("cx", fn_cx)
							.attr("cy", fn_cy)
							.attr("r", self._fn_radius)
					),
				exit =>
					exit.call(exit =>
						exit
							.transition(transition)
							.attr("r", 0)
							.remove()
					)
			);
		};
	}

	/**
	 *	@override
	 */
	draw(transition) {
		super.draw(transition);

		let self = this;

		self._group.classed("xy-circles", true);

		self._group
			.selectAll("circle")
			.data(self._chart.data.filter(self._fn_defined), self._chart.fn_key)
			.call(self._fn_draw, transition);
	}
}
