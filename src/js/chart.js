import * as d3 from "d3";

export default class Chart {
	constructor(container, params = {}) {
		let self = this;

		self._container = container;

		self.initChart(self, params)
		self.initComponents(self)
	}

	initChart(self, params) {

		self._size = {
			width: 400,
			height: 300
		}

		self._padding = {
			top: 10,
			right: 10,
			bottom: 10,
			left: 10
		};

		Object.assign(self._size, params.size || {});
		Object.assign(self._padding, params.padding || {});

		self._fn_key = params.fn_key || ((d, i) => i);
		self._valueDomain = params.valueDomain || [NaN, NaN]
		self._data = params.data || [];
		self._components = params.components || [];

	} 

	initComponents(self) {
		self._components.filter(c => !c.chart).forEach(c => c.chart = self)
	}

	// fits the size of the svg
	fn_fitSize(self) {
		if(self._container.node().tagName === "svg") {
			self._container.attr("width", `${self._size.width}px`);
			self._container.attr("height", `${self._size.height}px`);
		}
	}

	fn_getValueDomain(self) {
	
		const x = self._components
			.filter(c => c.fn_value)
			.map(c => d3.extent(self._data, c.fn_value))
			.reduce(
				(acc, cur) => [
					d3.min([cur[0], acc[0]]),
					d3.max([cur[1], acc[1]])
				],
				self._valueDomain
			);

		return x
	}

	get size() {
		let self = this;
		return self._size;
	}
	
	set size(size) {
		let self = this;
		Object.assign(self._size, size);
	}

	get fn_key() {
		let self = this;
		return self._fn_key;
	}

	get data() {
		let self = this;
		return self._data;
	}

	set data(data) {
		let self = this;
		self._data = data;
	}

	get components() {
		let self = this;
		return self._components;
	}

	set components(components) {
		let self = this;
		self._components = components;
		self._components.filter(c => !c.chart).forEach(c => c.chart = self)
	}

	get group() {
		let self = this;
		return self._group;
	}


	draw(transition) {
		let self = this;

		transition = transition || d3.transition().duration(0);

		self.fn_fitSize(self);

		// appending the group 
		self._group = self._group || self._container.append("g").classed("chart", true);

		// drawing the components

		self._components.forEach(component => component.draw(transition));

		// handling old components
		//self.components.forEach(component => component.group.classed("js__keep-chart-component", true));
		//self.group.selectAll(".component:not(.js__keep-chart-component)").remove(); // may be a problem with nested charts
		//self.components.forEach(component => component.group.classed("js__keep-chart-component", false));

		return self;
	}
}
