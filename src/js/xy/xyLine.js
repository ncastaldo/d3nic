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

		const fn_y0 = (d, i) => chart.fn_yScale.range()[0]

		const fn_line = d3.line()
			.defined(self._fn_defined)
			.x(fn_x)
			.y(fn_y)
			.curve(d3.curveMonotoneX);

		const fn_lineBottom = d3.line()
			.defined(self._fn_defined)
			.x(fn_x)
			.y(fn_y0)
			.curve(d3.curveMonotoneX);

		self._fn_draw = (group, transition) => {

			const oldLine = group.selectAll("path.drawn")

			const newLine = group
					.datum(chart.data)
					.append("path")

			if(!oldLine.empty()) {

				oldLine.transition(transition)
					.attr("opacity", 0)
					.remove()

			}
					
			newLine.call(line => {
					oldLine.empty() ? 
						line.attr("d", fn_lineBottom) : 
						line.attr("opacity", 0)
				})
				.classed("drawn", true)
				.attr("fill", "none")
				.attr("stroke", self._fn_stroke) 
				.attr("stroke-width", self._fn_strokeWidth) 
				.call(self._fn_enter)
				.transition(transition)
				.attr("opacity", self._fn_opacity)
				.attr("d", fn_line)


		};
	}

	/**
	 *	@override
	 */
	draw(transition) {
		super.draw(transition);

		let self = this;

		self._group.classed("xy-line", true);

		self._group.call(self._fn_draw, transition);
	}
}
