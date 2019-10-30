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
		const fn_scalePoint = d3.scalePoint()	
			.padding(0.5) // CENTERING THINGS LIKE A BOSS

		const fn_angle = (d, i) => fn_scalePoint(chart.fn_key(d, i))
		const fn_radius = (d, i) => chart.fn_radiusScale(self._fn_value(d, i))

		const fn_innerRadius = (d, i) => chart.fn_radiusScale.range()[0]

		const fn_line = d3.radialLine()
			.defined(self._fn_defined)
			.angle(fn_angle)
			.radius(fn_radius)
			.curve(d3.curveLinearClosed);

		const fn_innerLine = d3.radialLine()
			.defined(self._fn_defined)
			.angle(fn_angle)
			.radius(fn_innerRadius)
			.curve(d3.curveLinearClosed);

		self._fn_draw = (group, transition) => {

			fn_scalePoint
				.domain(chart.data.map(chart.fn_key))	
				.range(chart.fn_angleScale.range())

			const oldLine = group.selectAll("path.drawn")

			const newLine = group
					.datum(chart.data)
					.append("path")

			if(!oldLine.empty()) {

				oldLine.transition(transition)
					.attr("opacity", 0)
					.remove()

			}
					
			self._join = newLine.call(line => {
					oldLine.empty() ? 
						line.attr("d", fn_innerLine) : 
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

		self._group.classed("sector-line", true);

		self._group.call(self._fn_draw, transition);
	}
}