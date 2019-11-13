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

		self._valueDomain = params.valueDomain || [[NaN, NaN], [NaN, NaN]]

		self._projectionType = params.projectionType || d3.geoMercator;
		
		self._fn_geoProjection = self._projectionType()
		
		self._fn_geoProjection.clipExtent(self.getExtent(self))
			//.center(self.getValueDomain(self));

		console.log(self._fn_geoProjection)

		self._fn_geoPath = d3.geoPath().projection(self._fn_geoProjection)

	}

	/**
	 *	@override
	 */
	getValueDomain(self) {
		console.log(self._valueDomain)
		return self._components
			.map(c => c.fn_valueDomain(self._data))
			.reduce((acc, cur) => {
				acc[0][0] = d3.min([acc[0][0], cur[0][0]])
				acc[0][1] = d3.min([acc[0][1], cur[0][1]])
				acc[1][0] = d3.max([acc[1][0], cur[1][0]])
				acc[1][1] = d3.max([acc[1][1], cur[1][1]])
				return acc
			}, self._valueDomain)
	}


	getExtent(self) {

		return [ 
			[ self._padding.left, self._padding.top ],
			[ self._size.width - self._padding.right, self._size.height - self._padding.bottom ] 
		]

		// modifying geoPaths as well

		//self._projectionObject && self._fn_geoProjection.fitExtent(extent, self._projectionObject)

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
		//self.fn_fitExtent(self)
	}

	get projectionObject() {
		let self = this;
		return self._projectionObject;
	}

	set projectionObject(projectionObject) {
		let self = this;
		self._projectionObject = projectionObject;
		//self.fn_fitExtent(self)
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
