import * as d3 from '@/js/d3-modules.js';
import Chart from '@/js/chart.js'

export default class GeoChart extends Chart {
	constructor(container, params = {}) {
		super(container, params);
	}

	/**
	 *	@override
	 */
	initChart(self, params) {
		super.initChart(self, params);

		self._valueDomain = params.valueDomain || null
		self._projectionType = params.projectionType || d3.geoMercator;
		self._fn_geoProjection = self._projectionType()

		self.fitProjection(self)

	}

	/**
	 *	@override
	 */
	getValueDomain(self) {
		return self._valueDomain || self._components
			.map(c => c.fn_valueDomain(self._data))
			.flat(1)
	}


	fitProjection(self) {
		const extent = [ 
			[ self._padding.left, self._padding.top ],
			[ self._size.width - self._padding.right, self._size.height - self._padding.bottom ] 
		]
		self._fn_geoProjection.fitExtent(extent, {
			type: 'GeometryCollection',
			geometries: self.getValueDomain(self)
		})
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
		self.fitProjection(self)
	}

	/**
	 *	@override
	 */
	get data() {
		return super.data;
	}

	/**
	 *	@override
	 */
	set data(data) {
		super.data = data;

		let self = this;
		self.fitProjection(self)
	}

	get fn_geoProjection() {
		let self = this;
		return self._fn_geoProjection;
	}

	/**
	 *	@override
	 */
	draw(transition) {
		super.draw(transition);

		let self = this;
		self._group.classed("map-chart", true);
	}

}
