import PolarChart from '../polarChart.js'

export default class SectorChart extends PolarChart {
	constructor(container, params = {}) {
		super(container, params);
	}

	/**
	 *	@override
	 */
	initChart(self, params) {
		super.initChart(self, params)

		self._sectorPadding = {
			inner: 0,
			outer: 0
		}

		Object.assign(self._sectorPadding, params.sectorPadding || {})
 
		self._fn_radiusScale = d3
			.scaleLinear()
			.domain(self.fn_getValueDomain(self))
			.range(self.fn_getRadiusRange(self));

		self._fn_angleScale = d3
			.scaleBand()
			.paddingInner(self._sectorPadding.inner)
			.paddingOuter(self._sectorPadding.outer)
			.domain(self._data.map(self._fn_key))
			.range(self._angleRange);
	}

	/**
	 *	@override
	 */
	set size(size) {
		super.size = size;

		let self = this;
		self._fn_radiusScale.range(self.fn_getRadiusRange(self));
	}

	/**
	 *	@override
	 */
	get components() {
		return super.components;
	}

	/**
	 *	@override
	 */
	set components(components) {
		super.components = components;

		let self = this;
		self._fn_radiusScale.domain(self.fn_getValueDomain(self));

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
		self._fn_angleScale.domain(self._data.map(self._fn_key))
		self._fn_radiusScale.domain(self.fn_getValueDomain(self));
	}

	get fn_radiusScale() {
		let self = this;
		return self._fn_radiusScale;
	}

	get fn_angleScale() {
		let self = this;
		return self._fn_angleScale;
	}

	/**
	 *	@override
	 */
	draw(options) { 
		super.draw(options);

		let self = this;

		self._group.classed("sector-chart", true);
	}

}