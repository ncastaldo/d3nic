import * as d3 from '@/js/d3-modules.js';

export default class Chart {
	constructor(selector, params = {}) {
		let self = this;

		self._selector = selector;

		self.initChart(self, params)
		self.initComponents(self)
	}

	initChart(self, params) {

		self._container = null
		self._context = null
		self._fn_interval = null

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

	// fits the size of the svg or canvas
	fitContainer(self) {
		self._container
			.attr("width", self._size.width)
			.attr("height", self._size.height)
	}

	getValueDomain(self) {
		return self._components
			.map(c => c.fn_valueDomain(self._data))
			.reduce((acc, cur) => {
				return d3.extent(acc.concat(cur))
			}, self._valueDomain)
	}

	clearCanvas(self) {
		self._context.fillStyle = '#fff'
		self._context.fillRect(0, 0, self._size.width, self._size.height) 
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

	get transition() {
		let self = this;
		return self._transition;
	}

	get context() {
		let self = this;
		return self._context;
	}

	draw(tObject={}) {
		let self = this;

		// first draw?
		if (!self._group) {
			self._container = d3.select(self._selector)

			if (self._container.node() instanceof HTMLCanvasElement) {
				self._context = self._container.node().getContext("2d")
			}

			self._group = self._container
				.append("g")
				.classed("chart", true)
		}

		// adjusting the size
		self.fitContainer(self);

		// creating the transition
		const tName = tObject.hasOwnProperty('name') ? tObject.name : null
		const	tDuration = tObject.hasOwnProperty('duration') ? tObject.duration : 0	
		const	tDelay = tObject.hasOwnProperty('delay') ? tObject.delay : 0	
		
		self._transition = d3
			.transition(tName)
			.duration(tDuration)
			.delay(tDelay)

		// draw the nodes if it is not a canvas or the duration is zero
		if(!self._context || tDuration) {
			self._components.forEach(component => component.draw(self._transition));
		}

		if(self._context) {

			if(self._fn_interval) self._fn_interval.stop()


			//self.clearCanvas(self)

			const fn_drawComponentsCanvas = (elapsed) => {
				console.log('rendering canvas: ' + elapsed)

				self.clearCanvas(self)
				self._components.forEach(c => c.drawCanvas())

				if(elapsed>tDuration) self._fn_interval.stop()
			}

			if (tDuration) {
				self._fn_interval = d3.interval(fn_drawComponentsCanvas, 34)
			} else {
				self._transition.on("end.canvas interrupt.canvas", fn_drawComponentsCanvas)
			}
		}

		// handling old components
		//self.components.forEach(component => component.group.classed("js__keep-chart-component", true));
		//self.group.selectAll(".component:not(.js__keep-chart-component)").remove(); // may be a problem with nested charts
		//self.components.forEach(component => component.group.classed("js__keep-chart-component", false));

	}
}
