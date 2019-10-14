import Component from '../component.js'

export default class GeoTooltips extends Component {
	constructor(params = {}) {
		super(params);

		let self = this;
		self._size = {
			width: 100,
			height: 100
		}

		Object.assign(self._size, params.size || {})
	}

	/**
	 *	@override
	 */
	set chart(chart) {
		super.chart = chart;

		let self = this;

		const fn_centroid = d => chart.fn_geoPath.centroid(d)
		const fn_bounds = d => chart.fn_geoPath.bounds(d)

		const fn_x = d => fn_centroid(d)[0] < chart.size.width/2 ? 
			Math.min(fn_bounds(d)[1][0], chart.size.width - self.size.width) :
			Math.max(fn_bounds(d)[0][0] - self.size.width, 0) ;

		const fn_y = d => fn_centroid(d)[1] < chart.size.height/2 ? 
			Math.min(fn_bounds(d)[1][1], chart.size.height - self.size.height) :
			Math.max(fn_bounds(d)[0][1] - self.size.height, 0) ;

		self.fn_draw = (geoSvgs, options) => {

			geoSvgs.join(
				enter => enter
					.append("svg")
					.attr("x", fn_x)
					.attr("width", self._size.width)
					.attr("y", fn_y)
					.attr("height", self._size.height)
					.call(enter => self._fn_enter(enter, options))
					.append("circle")
					.attr("cx", self._size.width/2)
					.attr("cy", self._size.height/2)
					.attr("r", 5)
					.style("fill", (d, i, nodes) => d3.interpolateViridis(1-i/nodes.length))
					.style("fill-opacity", 0.3),
				update => update
					.attr("x", fn_x)
					.attr("width", self._size.width)
					.attr("y", fn_y)
					.attr("height", self._size.height)
					.select("circle")
					.attr("cx", self._size.width/2)
					.attr("cy", self._size.height/2),
				exit => exit
					.remove(),
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

		self._group.classed("geo-tooltips", true);

		self._group
			.selectAll("svg")
			.data(self._chart.data, self._chart.fn_key)
			.call(self._fn_draw, options);

		return self;
	}
}
