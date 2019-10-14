import Component from '../component.js'

export default class GeoSvgs extends Component {
	constructor(params = {}) {
		super(params);
	}

	/**
	 *	@override
	 */
	set chart(chart) {
		super.chart = chart;

		let self = this;

		const fn_bounds = d => chart.fn_geoPath.bounds(d)

		const fn_x = d => fn_bounds(d)[0][0]
		const fn_width = d => fn_bounds(d)[1][0] - fn_bounds(d)[0][0]

		const fn_y = d => fn_bounds(d)[0][1]
		const fn_height = d => fn_bounds(d)[1][1] - fn_bounds(d)[0][1]

		self.fn_draw = (geoSvgs, options) => {

			geoSvgs.join(
				enter => enter
					.append("svg")
					.attr("x", fn_x)
					.attr("width", fn_width)
					.attr("y", fn_y)
					.attr("height", fn_height)
					.append("circle")
					.attr("cx", d => fn_width(d)/2)
					.attr("cy", d => fn_height(d)/2)
					.attr("r", d => d3.min([fn_width(d), fn_height(d)])/2)
					.style("fill", (d, i, nodes) => d3.interpolateViridis(1-i/nodes.length)),
				update => update,
				exit => exit,
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

		self._group.classed("geo-svgs", true);

		self._group
			.selectAll("svg")
			.data(self._chart.data, self._chart.fn_key)
			.call(self._fn_draw, options);

		return self;
	}
}
