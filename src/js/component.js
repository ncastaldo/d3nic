import * as d3 from '@/js/d3-modules.js';

export default class Component {
	constructor(params = {}) {
		let self = this;

		self._chart = undefined;

		self._fn_stroke = params.fn_stroke || ( (d, i) => "black" );
		self._fn_strokeDasharray = params.fn_strokeDasharray || ((d, i) => [2, 2])
		self._fn_strokeWidth = params.fn_strokeWidth || ( (d, i) => 1 );
		self._fn_fill = params.fn_fill || ( (d, i) => "red" );
		self._fn_fillOpacity = params.fn_fillOpacity || ( (d, i) => 1 );
		self._fn_opacity = params.fn_opacity || ( (d, i) => 1 ); 
		
		self._fn_defined = params.fn_defined || ( (d, i) => true )
		
		self._fn_valueDomain = (data) => [NaN, NaN] // might be replaced in components

		self._fn_enter = params.fn_enter || (component => {})
		self._fn_update = params.fn_update || (component => {})
		self._fn_exit = params.fn_exit || (component => {})

		//self._join = []

		return self;
	}

	get fn_valueDomain() {
		let self = this;
		return self._fn_valueDomain;
	}

	get fn_defined() {
		let self = this;
		return self._fn_defined;
	}

	get chart() {
		let self = this;
		return self._chart;
	}

	set chart(chart) {
		let self = this;
		self._chart = chart;
	}

	get group() {
		let self = this;
		return self._group;
	}

	get join() {
		let self = this;
		return self._join || d3.select(null);
	}

	drawCanvas(context) {}

	draw(transition) {
		let self = this;

		// appending the group 
		if (!self._group) {
			self._group = self._chart.tagName !== "canvas" 
				? self._chart.group.append("g")
				: self._chart.group.append("custom")
			self._group.classed("component", true);
		}

		return self;
	}

}
