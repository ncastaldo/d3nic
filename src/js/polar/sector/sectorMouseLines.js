import PolarComponent from '../polarComponent.js'

export default class SectorMouseLines extends PolarComponent {
	constructor(params = {}) {
		super(params);

		let self = this;
		self._fn_strokeDasharray = params.fn_strokeDasharray || ((d, i) => [2, 2])
	}

	/**
	 *	@override
	 */
	set chart(chart) {
		super._chart = chart;

		let self = this;

		const fn_angle = (d, i) => chart.fn_angleScale(chart.fn_key(d, i)) + chart.fn_angleScale.bandwidth()/2

		const fn_xy = (angle, radius) => {
			
		}

		self._fn_draw = (mouseLines, options) => {

			const radiusExtent = chart.fn_radiusScale.range()

			mouseLines.join(
				enter => enter
					.append("path")
					.attr("d", (d, i) => `M ${fn_angle(d, i)}, ${radiusExtent[0]} ${fn_angle(d, i)}, ${radiusExtent[0]}`)
					.style("stroke", self._fn_stroke)
					.style("stroke-width", self._fn_strokeWidth)
					.style("stroke-dasharray", (d, i) => `${self._fn_strokeDasharray(d, i)[0]}, ${self._fn_strokeDasharray(d, i)[1]}`)
					.style("opacity", 0)
					.call(self.fn_enter)
					.call(enter => 
						enter
							.transition()
							.duration(options.duration)
							.attr("d", (d, i) => `M ${fn_angle(d, i)}, ${radiusExtent[0]} ${fn_angle(d, i)}, ${radiusExtent[1]}`)
							.style("opacity", self._fn_opacity)),
				update => update
					.call(update => 
						update
							.transition()
							.duration(options.duration)
							.style("opacity", self._fn_opacity)
							.attr("d", (d, i) => "M" + fn_angle(d, i) + "," + radiusExtent[0] + " " 
								+ fn_angle(d, i) + "," + radiusExtent[1]),
					),
				exit => exit
					.call(exit => 
						exit
							.transition()
							.duration(options.duration)
							.style("opacity", 0)
							.remove())
			)
		};
	}

	/**
	 *	@override
	 */
	draw(options) {
		super.draw(options);

		let self = this;

		self._group.classed("xy-mouse-lines", true);

		self._group
			.selectAll("path")
			.data(self._chart.data.filter(self._fn_defined), self._chart.fn_key)
			.call(self._fn_draw, options);
	}
}
