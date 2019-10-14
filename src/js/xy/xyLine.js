import Component from '../component.js'

export default class XyLine extends Component {
	constructor(params = {}) {
		super(params);

		let self = this;
		return self._
	}

	/**
	 *	@override
	 */
	set chart(chart) {
		super.chart = chart;

		let self = this;

		const fn_x = (d, i) => chart.fn_xScale(chart.fn_key(d, i))
		const fn_y = (d, i) => chart.fn_yScale(self._fn_value(d, i))

		const fn_line = d3.line()
			.defined(self._fn_defined)
			.x(fn_x)
			.y(fn_y)
			.curve(d3.curveMonotoneX);

		self._fn_draw = (line, options) => {

			line.join(
				enter =>
					enter
						.append("path")
						.attr("fill", "none") // to make it a line
						.attr("stroke", self._fn_stroke)
						.attr("stroke-width", self._fn_strokeWidth)
						.attr("d", fn_line)
						.style("opacity", self._fn_opacity)
						.call(self._fn_enter)
						.call(enter => {
							const lineLength = enter.node()
								? enter.node().getTotalLength()
								: 0;
							enter.attr("stroke-dasharray", `${lineLength} ${lineLength}`)
								.attr("stroke-dashoffset", lineLength)
								.transition()
								.duration(options.duration)
								.attr("stroke-dashoffset", 0)
						}),
				update =>
					update
						.attr("stroke-dasharray", null)
						.attr("stroke-dashoffset", null)
						.call(update => { 
							if(options.name === "data") {
								update.transition()
									.duration(options.duration / 2)
									.style("opacity", 0)
									.on("end", () => {
										update.attr("d", fn_line)
									})
									.transition()
									.duration(options.duration / 2)
									.style("opacity", self._fn_opacity)
							} else {
								update.transition()
									.duration(options.duration)
									.attr("d", fn_line)
							}
						})
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

		self._group.classed("xy-line", true);

		self._group
			.selectAll("path")
			.data([self._chart.data])
			.call(self._fn_draw, options);

		return self._
	}
}
