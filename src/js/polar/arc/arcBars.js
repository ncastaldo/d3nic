import PolarComponent from '../polarComponent.js'

export default class ArcBars extends PolarComponent {
	constructor(params = {}) {
		super(params);

		let self = this;

		self._padding = {
			inner: 0,
			outer: 0
		}

		Object.assign(self._padding, params.padding || {})

		return self;
	}

	/**
	 *	@override
	 */
	set chart(chart) {
		super.chart = chart;

		let self = this;

		const fn_startAngle = (d, i) => chart.fn_angleScale.range()[0]
		const fn_endAngle = (d, i) => chart.fn_angleScale(self._fn_value(d, i))
		const fn_innerRadius = (d, i) => chart.fn_radiusScale(chart.fn_key(d, i))
		const fn_outerRadius = (d, i) => chart.fn_radiusScale(chart.fn_key(d, i)) + chart.fn_radiusScale.bandwidth()

		self._fn_draw = (arcBars, transition) => {

			self._join = arcBars.join(
				enter => enter
					.append("path")
					.attr("stroke", self._fn_stroke)
					.attr("stroke-width", self._fn_strokeWidth)
					.attr("fill", self._fn_fill)
					.attr("opacity", 0)
					.each((d, i, nodes) => {

						const selection = d3.select(nodes[i])
						selection
							.attr("startAngleInitial", fn_startAngle(d, i))
							.attr("startAngle", fn_startAngle(d, i))
							.attr("endAngleInitial", fn_startAngle(d, i)) // START ANGLE, NOT END
							.attr("endAngle", fn_endAngle(d, i))
							.attr("innerRadiusInitial", fn_innerRadius(d, i))
							.attr("innerRadius", fn_innerRadius(d, i))
							.attr("outerRadiusInitial", fn_outerRadius(d, i))
							.attr("outerRadius", fn_outerRadius(d, i))
					
					})
					.call(enter => 
						enter.transition(transition)
							//.delay((d, i, nodes) => nodes.length ? (options.duration / 2) * i / nodes.length : 0)
							.attrTween("d", self._fn_arcTween)
							.attr("opacity", self._fn_opacity)),
				update => update
					.each((d, i, nodes) => {

						const selection = d3.select(nodes[i])
						selection
							.attr("startAngleInitial", fn_startAngle(d, i))
							.attr("startAngle", fn_startAngle(d, i))
							.attr("endAngleInitial", selection.attr("endAngle"))
							.attr("endAngle", fn_endAngle(d, i))
							.attr("innerRadiusInitial", selection.attr("innerRadius"))
							.attr("innerRadius", fn_innerRadius(d, i))
							.attr("outerRadiusInitial", selection.attr("outerRadius")) 
							.attr("outerRadius", fn_outerRadius(d, i))
					
					})
					.call(update => 
						update.transition(transition)
							//.delay((d, i, nodes) => nodes.length ? (options.duration / 2) * i / nodes.length : 0)
							.attrTween("d", self._fn_arcTween)
							.attr("fill", self._fn_fill)
							.attr("opacity", self._fn_opacity)),
				exit => exit
					.each((d, i, nodes) => {

						const selection = d3.select(nodes[i])
						selection
							.attr("startAngleInitial", selection.attr("startAngle"))
							//.attr("startAngle", selection.attr("startAngle"))
							.attr("endAngleInitial", selection.attr("endAngle"))
							.attr("endAngle", fn_startAngle(d, i))  // START ANGLE, NOT END
							.attr("innerRadiusInitial", selection.attr("innerRadius"))
							//.attr("innerRadius", selection.attr("innerRadius"))
							.attr("outerRadiusInitial", selection.attr("outerRadius")) // the interpolator will act on this
							//.attr("outerRadius", fn_outerRadius(d, i))

					})
					.call(exit => 
						exit.transition(transition)
							//.delay((d, i, nodes) => nodes.length ? (options.duration / 2) * i / nodes.length : 0)
							.attrTween("d", self.fn_arcTween)
							.attr("opacity", 0)
							.remove()),
			)
		}
	}

	/**
	 *	@override
	 */
	draw(options) {
		super.draw(options);

		let self = this;

		self._group.classed("arc-bars", true);

		self._group.selectAll("path")
			.data(self._chart.data.filter(self._fn_defined), self._chart.fn_key)
			.call(self._fn_draw, options)
	}
}
