import * as d3 from '@/js/d3-modules.js';
import Component from '@/js/component.js'

export default class XyMouseLines extends Component {
	constructor(params = {}) {
		super(params);

		let self = this;

		self._fn_strokeDasharray = params.fn_strokeDasharray || ((d, i) => [2, 2])
	}

	/**
	 *	@override
	 */
	set chart(chart) {
		super.chart = chart;

		let self = this;

		const fn_x = (d, i) => chart.fn_xScale(chart.fn_key(d, i)) + chart.fn_xScale.bandwidth()/2
		const fn_y0 = (d, i) => chart.fn_yScale.range()[0]
		const fn_y1 = (d, i) => chart.fn_yScale.range()[1]


		self._fn_draw = (mouseLines, transition) => {

			self._join = mouseLines.join(
				enter => enter
					.append("line")
					.attr("x1", fn_x)
					.attr("x2", fn_x)
					.attr("y1", fn_y0)
					.attr("y2", fn_y0)
					.attr("stroke", self._fn_stroke)
					.attr("stroke-width", self._fn_strokeWidth)
					.attr("stroke-dasharray", (d, i) => `${self._fn_strokeDasharray(d, i)[0]}, ${self._fn_strokeDasharray(d, i)[1]}`)
					.attr("opacity", 0)
					.call(self._fn_enter)
					.call(enter => 
						enter
							.transition(transition)
							.attr("y2", fn_y1)
							.attr("opacity", self._fn_opacity)),
				update => update
					.call(update => 
						update
							.transition(transition)
							.attr("opacity", self._fn_opacity)
							.attr("x1", fn_x)
							.attr("x2", fn_x)
							.attr("y1", fn_y0)
							.attr("y2", fn_y1)
					),
				exit => exit
					.call(exit => 
						exit
							.transition(transition)
							.attr("y1", fn_y0)
							.attr("y2", fn_y0)
							.attr("opacity", 0)
							.remove())
			)

		};
	}

	/**
	 *	@override
	 */
	draw(transition) {
		super.draw(transition);

		let self = this;

		self._group.classed("xy-mouse-lines", true);

		self._group
			.selectAll("path")
			.data(self._chart.data.filter(self._fn_defined), self._chart.fn_key)
			.call(self._fn_draw, transition)
	}
}
