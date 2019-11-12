import * as d3 from '@/js/d3-modules.js';
import Component from '@/js/component.js'

export default class XyBars extends Component {
	constructor(params = {}) {
		super(params);

		let self = this;

		self._fn_bottomValue = params.fn_bottomValue || ((d) => NaN)
		self._fn_topValue = params.fn_topValue || ((d) => d)

		self._fn_valueDomain = (data) => d3.extent(
			data.map((d, i) => [
				self._fn_bottomValue(d, i),
				self._fn_topValue(d, i)
			]).flat()
		)
	}

	/**
	 *	@override
	 */
	set chart(chart) {
		super.chart = chart;

		let self = this;

		const fn_x = (d, i) => chart.fn_xScale(chart.fn_key(d, i));
		const fn_width = (d, i) => chart.fn_xScale.bandwidth();
		
		const fn_y = (d, i) => chart.fn_yScale(self._fn_topValue(d, i));
		const fn_yBottom = (d, i) => !isNaN(self._fn_bottomValue(d, i))
			? chart.fn_yScale(self._fn_bottomValue(d, i))
			: chart.fn_yScale.range()[0]
		
		const fn_height = (d, i) => fn_yBottom(d, i) - fn_y(d, i);
		const fn_heightBottom = (d, i) => 0;

		self._fn_draw = (bars, transition) => {

			self._join = bars.join(
				enter => enter
					.append("rect")
					.attr("x", fn_x)
					.attr("width", fn_width)
					.attr("y", fn_yBottom)
					.attr("height", fn_heightBottom)
					.attr("stroke", self._fn_stroke)
					.attr("stroke-width", self._fn_strokeWidth)
					.attr("fill", self._fn_fill)
					.attr("opacity", 0)
					.call(self._fn_enter)
					.call(enter => enter.transition(transition)
						//(d, i, nodes) => nodes.length ? (options.duration / 2) : options.duration)
						//.delay((d, i, nodes) => nodes.length ? (options.duration / 2) * i / nodes.length : 0)
						.attr("y", fn_y)
						.attr("height", fn_height)
						.attr("opacity", self._fn_opacity)),
				update => update
					.call(update => update.transition(transition)
						.attr("fill", self._fn_fill)
						.attr("x", fn_x)
						.attr("width", fn_width)
						.attr("y", fn_y)
						.attr("height", fn_height)
						.attr("opacity", self._fn_opacity)),
				exit => exit
					.call(exit => exit.transition(transition)
						//(d, i, nodes) => nodes.length ? (options.duration / 2) : options.duration)
						//.delay((d, i, nodes) => nodes.length ? (options.duration / 2) * i / nodes.length : 0)
						//.attr("width", (d, i) => barWidth)
						.attr("y", fn_yBottom)
						.attr("height", fn_heightBottom)
						.attr("opacity", 0)
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
