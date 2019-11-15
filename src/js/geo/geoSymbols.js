import * as d3 from '@/js/d3-modules.js';
import Component from '@/js/component.js'

export default class GeoSymbols extends Component {
	constructor(params = {}) {
		super(params);

    let self = this;
		
		self._fn_type = params.fn_type || ((d, i) => d3.symbolCircle);
		self._fn_size = params.fn_size || ((d, i) => 3);

		self._fn_value = params.fn_value || ((d, i) => d)
		self._fn_valueDomain = (data) => data.filter(self._fn_defined).map(d => self._fn_value(d))
	}

	/**
	 *	@override
	 */
	set chart(chart) {
		super.chart = chart;

		let self = this;

		const fn_geoPath = d3.geoPath().projection(chart.fn_geoProjection)

		self._fn_path2D = d3.symbol()

		self._fn_x = (d, i) => fn_geoPath.centroid(self._fn_value(d, i))[0]
		self._fn_y = (d, i) => fn_geoPath.centroid(self._fn_value(d, i))[1]
		self._fn_path = (d, i) => self._fn_path2D
			.type(self._fn_type(d, i))
			.size(self._fn_size(d, i))
			(self._fn_value(d, i))

		const fn_pathInitial = (d, i) => d3.symbol().type(self._fn_type(d, i)).size(1)()

		self._fn_draw = (geoSymbols, transition) => {

			self._join = geoSymbols.join(
				enter => enter
					.append("path")
					.attr("stroke", self._fn_stroke)
					.attr("stroke-width", self._fn_strokeWidth)
					.attr("fill", self._fn_fill)
					.attr("fill-opacity", self._fn_fillOpacity)
					.attr("transform", (d, i) => `translate(${self._fn_x(d, i)}, ${self._fn_y(d, i)})`)
					.attr("d", fn_pathInitial)
					.attr("opacity", 0)
					.call(self._fn_enter)
					.call(enter => {

						enter.transition(transition)
							.attr("d", self._fn_path)
							.attr("opacity", self._fn_opacity)
			
					}),
				update => update
					.call(self._fn_update)
					.call(update => {

						update.transition(transition)
							.attr("transform", (d, i) => `translate(${self._fn_x(d, i)}, ${self._fn_y(d, i)})`)
              .attr("d", self._fn_path)
							.attr("stroke", self._fn_stroke)
							.attr("stroke-width", self._fn_strokeWidth)
							.attr("fill", self._fn_fill)
							.attr("opacity", self._fn_opacity)

					
					}),
				exit => exit
					.call(self._fn_exit)
					.call(exit => {
            exit.transition(transition)
							.attr("transform", (d, i) => `translate(${self._fn_x(d, i)}, ${self._fn_y(d, i)})`)
              .attr("d", fn_pathInitial)
							.attr("opacity", 0)
							.remove()
					}),
			)

		};
	
	}

	/**
	 *	@override
	 */
	draw(transition) {
		super.draw(transition);

		let self = this;

		self._group.classed("geo-symbols", true);

		console.log(self._chart.data)

		self._group
			.selectAll("path")
			.data(self._chart.data.filter(self._fn_defined), self._chart.fn_key)
			.call(self._fn_draw, transition);
		
	}
}
