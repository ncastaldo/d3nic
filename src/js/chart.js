import * as d3 from '@/js/d3-modules.js';

export default class Chart {
	constructor(selector, params = {}) {
		let self = this;

		self._selector = selector;

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
	fitSize(self) {
		const selection = d3.select(self._selector);
		const tagName = selection.node().tagName;
		//if(tagName === "svg" || tagName === "canvas") {
			selection.attr("width", self._size.width);
			selection.attr("height", self._size.height);
		//}
	}

	getValueDomain(self) {
		return self._components
			.map(c => c.fn_valueDomain(self._data))
			.reduce((acc, cur) => {
				return d3.extent(acc.concat(cur))
			}, self._valueDomain)
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

	get tagName() {
		let self = this;
		return self._tagName;
	}


	draw(tObject={}) {
		let self = this;

		const selection = d3.select(self._selector)

		self.fitSize(self);

		// appending the group 
		if (!self._group) {
			self._tagName = selection.node().tagName.toLowerCase()
			self._group = self._tagName !== "canvas" ? selection.append("g") : selection
			self._group.classed("chart", true)
		}

		const tName = tObject.hasOwnProperty('name') ? tObject.name : null
		const	tDuration = tObject.hasOwnProperty('duration') ? tObject.duration : 0	
		const	tDelay = tObject.hasOwnProperty('delay') ? tObject.delay : 0	
		
		const transition = selection
			.transition(tName)
			.duration(tDuration)
			.delay(tDelay)

		if(self._tagName !== "canvas" || tDuration) {
			self._components.forEach(component => component.draw(transition));
		}

		if(self._tagName === "canvas") {
			const context = self._group.node().getContext("2d")
			context.fillStyle = '#fff';
			context.fillRect(
				self._padding.left, 
				self._padding.top, 
				self._size.width - self._padding.right, 
				self._size.height - self._padding.bottom
			); 
			self._components.forEach(c => c.drawCanvas(transition))			
			//.on("end.canvas interrupt.canvas", callback)
		}

		// handling old components
		//self.components.forEach(component => component.group.classed("js__keep-chart-component", true));
		//self.group.selectAll(".component:not(.js__keep-chart-component)").remove(); // may be a problem with nested charts
		//self.components.forEach(component => component.group.classed("js__keep-chart-component", false));

	}
}
