import Chart from '../chart.js'

export default class GeoChart extends Chart {
	constructor(container, params = {}) {
		super(container, params);
	}

	/**
	 *	@override
	 */
	initChart(self, params) {
		super.initChart(self, params);

		self._projectionType = params.projectionType || d3.geoMercator;
		self._fn_geoProjection = self._projectionType();
		self._fn_geoPath = d3.geoPath().projection(self._fn_geoProjection);
		
		self.fn_fitExtent(self)
	}


	fn_fitExtent(self) {

		const extent = [ 
			[ self._padding.left, self._padding.top ],
			[ self._size.width - self._padding.right, self._size.height - self._padding.bottom ] 
		]

		// modifying geoPath as a consequence
		self._fn_geoProjection.fitExtent(extent, {type: "FeatureCollection", features: self._data})

	}

	/**
	 *	@override
	 */
	get size() {
		return super.size;
	}

	/**
	 *	@override
	 */
	set size(size) {
		super.size = size;

		let self = this;
		self.fn_fitExtent(self)
	}

	/**
	 *	@override
	 */
	get data() {
		return super.data;
	}

	set data(data) {
		super.data = data;

		let self = this;
		self.fn_fitExtent(self)
	}

	get fn_geoPath() {
		let self = this;
		return self._fn_geoPath
	}

	/**
	 *	@override
	 */
	draw(options) {
		super.draw(options);

		let self = this;
		self._group.classed("map-chart", true);
	}

}
