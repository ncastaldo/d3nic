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

		self._projectionType = params.projectionType || d3.geoMercator;
		self._projectionObject = params.projectionObject || undefined;
		
		self._fn_geoProjection = self._projectionType();
		self.fn_fitExtent(self)

		self._fn_geoPath = d3.geoPath().projection(self._fn_geoProjection)

	}


	fn_fitExtent(self) {

		const extent = [ 
			[ self._padding.left, self._padding.top ],
			[ self._size.width - self._padding.right, self._size.height - self._padding.bottom ] 
		]

		// modifying geoPaths as well

		self._projectionObject && self._fn_geoProjection.fitExtent(extent, self._projectionObject)

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

	get projectionObject() {
		let self = this;
		return self._projectionObject;
	}

	set projectionObject(projectionObject) {
		let self = this;
		self._projectionObject = projectionObject;
		self.fn_fitExtent(self)
	}

	get fn_geoPath() {
		let self = this;
		return self._fn_geoPath;
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
