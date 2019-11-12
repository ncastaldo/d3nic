import * as d3 from '@/js/d3-modules.js';
import Chart from '@/js/chart.js'

export default class XyChart extends Chart {
	constructor(container, params = {}) {
		super(container, params);
	}

	/**
	 *	@override
	 */
	initChart(self, params) {
		super.initChart(self, params)

		self._xPadding = {
			inner: 1,
			outer: 0
		} // scalepoint

		Object.assign(self._xPadding, params.xPadding || {})

		self._fn_xScale = d3
			.scaleBand()
			.paddingInner(self._xPadding.inner)
			.paddingOuter(self._xPadding.outer)
			.domain(self._data.map(self._fn_key))
			.range([
				self._padding.left,
				self._size.width - self._padding.right
			]);

		self._fn_yScale = d3
			.scaleLinear()
			.domain(self.getValueDomain(self))
			.range([
				self._size.height - self._padding.bottom,
				self._padding.top
			]);

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

		self._fn_xScale.range([
			self._padding.left,
			self._size.width - self._padding.right
		]);

		self._fn_yScale.range([
			self._size.height - self._padding.bottom,
			self._padding.top
		]);

		return self;
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
		
		self._fn_yScale.domain(self.getValueDomain(self));
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

		self._fn_xScale.domain(self._data.map(self._fn_key));
		self._fn_yScale.domain(self.getValueDomain(self));
	}


	get fn_xScale() {
		let self = this;
		return self._fn_xScale;
	}

	get fn_yScale() {
		let self = this;
		return self._fn_yScale;
	}


	/**
	 *	@override
	 */
	draw(transition) { 
		super.draw(transition);

		let self = this;

		self._group.classed("xy-chart", true);
	}

}
