import PolarComponent from '../polarComponent.js'

export default class SectorArea extends PolarComponent {
	constructor(params = {}) {
		super(params);
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
		const fn_innerRadius = (d, i) => chart.fn_radiusScale.range()[0]
		const fn_outerRadius = (d, i) => chart.fn_radiusScale(self._fn_value(d, i))

		const fn_area = d3.radialArea()
			.defined(self._fn_defined)
			.angle(fn_angle)
			.innerRadius(fn_innerRadius)
			.outerRadius(fn_outerRadius)
			.curve(d3.curveLinearClosed);

		self._fn_draw = (area, options) => {

			fn_scalePoint.domain(chart.data.map(chart.fn_key))	
				.range(chart.fn_angleScale.range())

			area.join(
				enter => enter
					.append("path")
					.call(enter => {
						fn_area.outerRadius(fn_innerRadius) // bottom -> up
						enter.attr("d", fn_area)
					})
					.attr("fill", self._fn_fill) 
					.attr("fill-opacity", self._fn_fillOpacity)
					.style("opacity", self._fn_opacity)
					.call(self._fn_enter)
					.call(enter => {
						fn_area.outerRadius(fn_outerRadius)

						enter.transition()
							.duration(options.duration)
							.attr("d", fn_area)
					}),
				update => update
					.call(update => {
						if (options.name === "data") {
							update.transition()
								.duration(options.duration / 2)
								.style("opacity", 0)
								.on("end", () => {
									update.attr("d", fn_area)
								})
								.transition(options.name)
								.duration(options.duration / 2)
								.style("opacity", self._fn_opacity)
						} else {
							update.transition()
								.duration(options.duration)
								.attr("d", fn_area)
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

		self._group.classed("xy-area", true);

		self._group
			.selectAll("path")
			.data([self._chart.data])
			.call(self._fn_draw, options);
	}
}
