import Component from '../component.js'

export default class XyArea extends Component {
	constructor(params = {}) {
		super(params);

		let self = this;

		return self;
	}

	/**
	 *	@override
	 */
	set chart(chart) {
		super.chart = chart;

		let self = this;

		const fn_x = (d, i) => chart.fn_xScale(chart.fn_key(d, i))
		const fn_y0 = (d, i) => chart.fn_yScale.range()[0]
		const fn_y1 = (d, i) => chart.fn_yScale(self._fn_value(d, i))

		const fn_area = d3.area()
			.defined(self._fn_defined)
			.x(fn_x)
			.y0(fn_y0)
			.y1(fn_y1)
			.curve(d3.curveMonotoneX);

		self._fn_draw = (area, transition) => {

			const halfTransition = d3
				.transition(transition._name + ".half")
				.duration(transition.duration() / 2)

			area.join(
				enter => enter
					.append("path")
					.call(enter => {
						fn_area.y1(fn_y0) // bottom-up
						enter.attr("d", fn_area)
					})
					.attr("fill", self._fn_fill) 
					.attr("fill-opacity", self._fn_fillOpacity)
					.style("opacity", self._fn_opacity)
					.call(self._fn_enter)
					.call(enter => {
						fn_area.y1(fn_y1)

						enter.transition(transition)
							.attr("d", fn_area)
					}),
				update => update
					.call(update => {
						if (transition._name === "data") {
							update.transition(halfTransition)
								.style("opacity", 0)
								.on("end", () => {
									update.attr("d", fn_area)
								})
								.transition(halfTransition)
								.style("opacity", self._fn_opacity)
						} else {
							update.transition(transition)
								.attr("d", fn_area)
						}
						
					})
			)

		};
	}

	/**
	 *	@override
	 */
	draw(transition) {
		super.draw(transition);

		let self = this;

		self._group.classed("xy-area", true);

		self._group
			.selectAll("path")
			.data([self._chart.data])
			.call(self._fn_draw, transition);
	}
}
