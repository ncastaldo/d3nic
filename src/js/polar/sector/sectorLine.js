import PolarComponent from '../polarComponent.js'

export default class SectorLine extends PolarComponent {
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

		// fn_scaleBand refers to the position of the bars
		const fn_angle = (d, i) => chart.fn_angleScale(chart.fn_key(d, i)) + chart.fn_angleScale.bandwidth()/2
		const fn_radius = (d, i) => chart.fn_radiusScale(self._fn_value(d, i))

		const fn_line = d3.radialLine()
			.defined(self._fn_defined)
			.angle(fn_angle)
			.radius(fn_radius)
			.curve(d3.curveLinearClosed);

		self._fn_draw = (line, options) => {

			line.join(
				enter => enter
					.append("path")
					.attr("fill", "none") // to make it a line
					.attr("stroke", self._fn_stroke)
					.attr("stroke-width", self._fn_strokeWidth)
					.style("opacity", self._fn_opacity)
					.attr("d", fn_line)
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
							.on("end", () => {
								enter.attr("stroke-dasharray", null)
									.attr("stroke-dashoffset", null);
							})
					}),
				update => update
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

		self._group.classed("xy-line", true);

		self._group
			.selectAll("path")
			.data([self._chart.data])
			.call(self._fn_draw, options);
	}
}
