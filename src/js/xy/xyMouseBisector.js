import Component from '../component.js'

export default class XyMouseBisector extends Component {
	constructor(params = {}) {
		super(params);

		let self = this;

		self._fn_onMouseenterAction = params.fn_onMouseenterAction || (() => {});
		self._fn_onMouseoverAction = params.fn_onMouseoverAction || ((d, i) => {});
		self._fn_onMouseoutAction = params.fn_onMouseoutAction || ((d, i) => {});
		self._fn_onMouseleaveAction = params.fn_onMouseleaveAction || (() => {});

		return self._
	}

	/**
	 *	@override
	 */
	set chart(chart) {
		super.chart = chart;

		let self = this;

		const mouseScale = d3.scaleQuantize();

		self._fn_draw = (group, transition) => {
			const x0 = chart.fn_xScale.range()[0];
			const x1 = chart.fn_xScale.range()[1];

			const y0 = chart.fn_yScale.range()[1]; // reversed
			const y1 = chart.fn_yScale.range()[0];

			// ADJUSTING THE STEP for lines/areas... put flag in case of bars...

			const step = chart.data.length ? Math.abs((x0 - x1) / chart.data.length) : 0;

			const domain = [x0 - step / 2, x1 + step / 2]; // if negative?

			mouseScale
				.domain(domain)
				.range(chart.data.length ? 
					chart.data.map((d, i) => i) :  // use index to keep information on it
					[0]);

			// helpers
			let dLast;
			let iLast = NaN;

			let inside = false;

			// mouse handlers

			const fn_onMousemove = (d, i, nodes) => {
				const x = d3.mouse(nodes[i])[0];
				const y = d3.mouse(nodes[i])[1];

				if (x0 <= x && x <= x1 && y0 <= y && y <= y1) {
					if (!inside) {
						self._fn_onMouseenterAction(); // ENTERING
						inside = true;
					}

					const i = mouseScale(x);
					const d = chart.data[i];

					if (iLast !== i) {
						if (!isNaN(iLast)) {
							self._fn_onMouseoutAction(dLast, iLast);
						}

						self._fn_onMouseoverAction(d, i);

						dLast = d;
						iLast = i;
					}
				} else {
					if (inside) {
						if (!isNaN(iLast)) {
							self._fn_onMouseoutAction(dLast, iLast);
							iLast = NaN;
						}

						self._fn_onMouseleaveAction(); // LEAVING
						inside = false;
					}
				}
			};

			const fn_onMouseleave = () => {
				if (inside) {
					if (!isNaN(iLast)) {
						self._fn_onMouseoutAction(dLast, iLast);
						iLast = NaN;
					}

					self._fn_onMouseleaveAction(); // LEAVING
					inside = false;
				}
			};

			// TODO APPEND RECT

			group.on("mousemove.mouse-bisector", fn_onMousemove);
			group.on("mouseleave.mouse-bisector", fn_onMouseleave);
		};

		return self._
	}

	/**
	 *	@override
	 */
	draw(transition) {
		super.draw(transition);

		let self = this;

		self._group.classed("xy-mouse-bisector", true)

		self._chart.group.call(self._fn_draw, transition);

		return self._
	}
}
