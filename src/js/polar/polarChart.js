import Chart from '../chart.js'

export default class PolarChart extends Chart {
	constructor(container, params = {}) {
		super(container, params);
 	}

 	/**
	 *	@override
	 */
	initChart(self, params) {
		super.initChart(self, params)

		self._radiusRangeProportions = params.radiusRangeProportions || [0, 1]
		self._angleRange = params.angleRange || [0, 2*Math.PI]; // may be, for instance, [0, 2/3*Math.PI]
	}


	fn_getRadiusRange(self) {

		const radius = Math.min(self._size.width - self._padding.left - self._padding.right, self._size.height - self._padding.top - self._padding.bottom) / 2;
		
		return self._radiusRangeProportions.map(rrp => rrp * radius)

	}

	fn_getCentroid(self) {

		return [
			self._size.width + self._padding.left - self._padding.right, 
			self._size.height + self._padding.top - self._padding.bottom
		].map(n => n/2)

	}


	/**
	 *	@override
	 */
	draw(options) { 
		super.draw(options);

		let self = this;

		const init = !self._group.classed("polar-chart"); // if not classed as polar-chart then init
		self._group.classed("polar-chart", true)

		const centroid = self.fn_getCentroid(self)

		const g = init ? self._group : self._group.transition().duration(options.duration)
		g.attr("transform", `translate(${centroid[0]}, ${centroid[1]})`);


		return self;
	}

}