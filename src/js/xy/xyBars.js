import Component from '../component.js'

export default class XyBars extends Component {
	constructor(params = {}) {
		super(params);
		let self = this;
	}

	/**
	 *	@override
	 */
	set chart(chart) {
		super.chart = chart;

		let self = this;

		self._fn_draw = (bars, transition) => {

			// fn_barScale refers to the height of the bars
			const fn_barScale = chart.fn_yScale.copy()
				.range([0, chart.fn_yScale.range()[0] - chart.fn_yScale.range()[1] ])

			const barWidth = chart.fn_xScale.bandwidth()

			bars.join(
				enter => enter
					.append("rect")
					.attr("x", (d, i) => chart.fn_xScale(chart.fn_key(d, i)))
					.attr("width", barWidth)
					.attr("y", (d, i) => chart.fn_yScale.range()[0])
					.attr("height", 0)
					.style("stroke", self._fn_stroke)
					.style("stroke-width", self._fn_strokeWidth)
					.style("fill", self._fn_fill)
					.style("opacity", 0)
					.call(self._fn_enter)
					.call(enter => enter.transition(transition)
						//(d, i, nodes) => nodes.length ? (options.duration / 2) : options.duration)
						//.delay((d, i, nodes) => nodes.length ? (options.duration / 2) * i / nodes.length : 0)
						.attr("width", (d, i) => barWidth)
						.attr("y", (d, i) => chart.fn_yScale(self._fn_value(d, i)))
						.attr("height", (d, i) => self._fn_defined(d, i) ? fn_barScale(self._fn_value(d, i)) : 0)
						.style("opacity", self._fn_opacity)),
				update => update
					.call(update => update.transition(transition)
						.style("fill", self._fn_fill)
						.attr("x", (d, i) => chart.fn_xScale(chart.fn_key(d, i)))
						.attr("width", (d, i) => barWidth)
						.attr("y", (d, i) => chart.fn_yScale(self._fn_value(d, i)))
						.attr("height", (d, i) => self._fn_defined(d, i) ? fn_barScale(self._fn_value(d, i)) : 0)
						.style("opacity", self._fn_opacity)),
				exit => exit
					.call(exit => exit.transition(transition)
						//(d, i, nodes) => nodes.length ? (options.duration / 2) : options.duration)
						//.delay((d, i, nodes) => nodes.length ? (options.duration / 2) * i / nodes.length : 0)
						//.attr("width", (d, i) => barWidth)
						.attr("y", (d, i) => chart.fn_yScale.range()[0])
						.attr("height", (d, i) => 0)
						.style("opacity", 0)
						.remove())
			)
		}
	}

	/**
	 *	@override
	 */
	draw(transition) {
		super.draw(transition);

		let self = this;

		self._group.classed("xy-bars", true);

		self._group.selectAll("rect")
			.data(self._chart.data.filter(self._fn_defined), self._chart.fn_key)
			.call(self._fn_draw, transition)
	}
}
