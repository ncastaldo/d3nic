import Component from '../component.js'

export default class XyCircles extends Component {
	constructor(params = {}) {
		super(params);

		let self = this;

		self._fn_radius = params.fn_radius || ((d, i) => 3);

		return self._
	}

	/**
	 *	@override
	 */
	set chart(chart) {
		super.chart = chart;

		let self = this;

		const fn_cx = (d, i) => chart.fn_xScale(chart.fn_key(d, i))
		const fn_cy = (d, i) => chart.fn_yScale(self._fn_value(d, i))

		self._fn_draw = (circles, options) => {

			circles.join(
				enter =>
					enter
						.append("circle")
						.attr("cx", fn_cx)
						.attr("cy", fn_cy)
						.style("stroke", self._fn_stroke)
						.style("stroke-width", self._fn_strokeWidth)
						.style("fill", self._fn_fill)
						.style("opacity", self._fn_opacity)
						.attr("r", 0)
						.call(enter => {
							enter.transition()
								.duration((d, i, nodes) => nodes.length ? (options.duration / 2) : options.duration)
								.delay((d, i, nodes) => nodes.length ? (options.duration / 2) * i / nodes.length : 0)
								.attr("r", self._fn_radius)
						}),
				update =>
					update.call(update =>
						update
							.transition()
							.duration(options.duration)
							.attr("cx", fn_cx)
							.attr("cy", fn_cy)
							.attr("r", self._fn_radius)
					),
				exit =>
					exit.call(exit =>
						exit
							.transition()
							.duration((d, i, nodes) => nodes.length ? (options.duration / 2) : options.duration)
							.delay((d, i, nodes) => nodes.length ? (options.duration / 2) * i / nodes.length : 0)
							.attr("r", 0)
							.remove()
					)
			);
		};

		return self._
	}

	/**
	 *	@override
	 */
	draw(options) {
		super.draw(options);

		let self = this;

		self._group.classed("xy-circles", true);

		self._group
			.selectAll("circle")
			.data(self._chart.data.filter(self._fn_defined), self._chart.fn_key)
			.call(self._fn_draw, options);

		return self._
	}
}
