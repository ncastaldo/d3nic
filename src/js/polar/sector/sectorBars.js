import PolarComponent from '../polarComponent.js'

export default class SectorBars extends PolarComponent {
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

		const fn_startAngle = (d, i) => chart.fn_angleScale(chart.fn_key(d, i))
		const fn_endAngle = (d, i) => chart.fn_angleScale(chart.fn_key(d, i)) + chart.fn_angleScale.bandwidth()
		const fn_innerRadius = (d, i) => chart.fn_radiusScale.range()[0]
		const fn_outerRadius = (d, i) => chart.fn_radiusScale(self._fn_value(d, i))

		self._fn_draw = (radialBars, options={}) => {

			radialBars.join(
				enter => enter
					.append("path")
					.style("stroke", self._fn_stroke)
					.style("stroke-width", self._fn_strokeWidth)
					.style("fill", self._fn_fill)
					.style("opacity", 0)
					.each((d, i, nodes) => {

						const selection = d3.select(nodes[i])
						selection
							.attr("startAngleInitial", fn_startAngle(d, i))
							.attr("startAngle", fn_startAngle(d, i))
							.attr("endAngleInitial", fn_endAngle(d, i))
							.attr("endAngle", fn_endAngle(d, i))
							.attr("innerRadiusInitial", fn_innerRadius(d, i))
							.attr("innerRadius", fn_innerRadius(d, i))
							.attr("outerRadiusInitial", fn_innerRadius(d, i)) // INNER HERE (NOT OUTER)
							.attr("outerRadius", fn_outerRadius(d, i))
					
					})
					.call(enter => 
						enter.transition()
							.duration(options.duration)//.duration((d, i, nodes) => nodes.length ? (options.duration / 2) : options.duration)
							//.delay((d, i, nodes) => nodes.length ? (options.duration / 2) * i / nodes.length : 0)
							.attrTween("d", self._fn_arcTween)
							.style("opacity", self._fn_opacity)),
				update => update
					.each((d, i, nodes) => {

						const selection = d3.select(nodes[i])
						selection
							.attr("startAngleInitial", selection.attr("startAngle"))
							.attr("startAngle", fn_startAngle(d, i))
							.attr("endAngleInitial", selection.attr("endAngle"))
							.attr("endAngle", fn_endAngle(d, i))
							.attr("innerRadiusInitial", selection.attr("innerRadius"))
							.attr("innerRadius", fn_innerRadius(d, i))
							.attr("outerRadiusInitial", selection.attr("outerRadius"))
							.attr("outerRadius", fn_outerRadius(d, i))

					})
					.call(update => 
						update.transition()
							.duration(options.duration)//.duration((d, i, nodes) => nodes.length ? (options.duration / 2) : options.duration)
							//.delay((d, i, nodes) => nodes.length ? (options.duration / 2) * i / nodes.length : 0)
							.attrTween("d", self._fn_arcTween)
							.style("fill", self._fn_fill)
							.style("opacity", self._fn_opacity)),
				exit => exit
					.each((d, i, nodes) => {

						const selection = d3.select(nodes[i])
						selection
							.attr("startAngleInitial", selection.attr("startAngle"))
							//.attr("startAngle",selection.attr("startAngle"))
							.attr("endAngleInitial", selection.attr("endAngle"))
							//.attr("endAngle", selection.attr("endAngle"))
							.attr("innerRadiusInitial", selection.attr("innerRadius"))
							//.attr("innerRadius", selection.attr("innerRadius"))
							.attr("outerRadiusInitial", selection.attr("outerRadius"))
							.attr("outerRadius", fn_innerRadius(d, i)) // INNER HERE (NOT OUTER)

					})
					.call(exit => 
						exit.transition()
							.duration(options.duration)//.duration((d, i, nodes) => nodes.length ? (options.duration / 2) : options.duration)
							//.delay((d, i, nodes) => nodes.length ? (options.duration / 2) * i / nodes.length : 0)
							.attrTween("d", self._fn_arcTween)
							.style("opacity", 0)
							.remove()),
			)
		}

		return self;
	}

	/**
	 *	@override
	 */
	draw(options) {
		super.draw(options);

		let self = this;

		self._group.classed("sector-bars", true);

		self._group.selectAll("path")
			.data(self._chart.data.filter(self._fn_defined), self._chart.fn_key)
			.call(self._fn_draw, options)

		return self;
	}
}
