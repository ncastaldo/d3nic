import * as d3 from '@/js/d3-modules.js';
import Component from '@/js/component.js'

export default class GeoCircles extends Component {
	constructor(params = {}) {
		super(params);

    let self = this;
    
		self._fn_radius = params.fn_radius || ((d, i) => 3);

		self._fn_value = params.fn_value || ((d, i) => d)
		self._fn_valueDomain = (data) => data.filter(self._fn_defined).map(d => self._fn_value(d))
	}

	/**
	 *	@override
	 */
	set chart(chart) {
		super.chart = chart;

		let self = this;

		const fn_geoPath = d3.geoPath().projection(chart.fn_geoProjection)

    self._fn_cx = (d, i) => fn_geoPath.centroid(self._fn_value(d, i))[0]
    self._fn_cy = (d, i) => fn_geoPath.centroid(self._fn_value(d, i))[1]

		self._fn_draw = (geoCircles, transition) => {

			self._join = geoCircles.join(
				enter => enter
					.append("circle")
					.attr("stroke", self._fn_stroke)
					.attr("stroke-width", self._fn_strokeWidth)
					.attr("fill", self._fn_fill)
					.attr("fill-opacity", self._fn_fillOpacity)
          .attr("opacity", 0)
          .attr("cx", self._fn_cx)
          .attr("cy", self._fn_cy)
          .attr("r", 0)
					.call(self._fn_enter)
					.call(enter => {

						enter.transition(transition)
							.attr("r", self._fn_radius)
							.attr("opacity", self._fn_opacity)
			
					}),
				update => update
					.call(self._fn_update)
					.call(update => {

						update.transition(transition)
              .attr("cx", self._fn_cx)
              .attr("cy", self._fn_cy)
              .attr("r", self._fn_radius)
							.attr("stroke", self._fn_stroke)
							.attr("stroke-width", self._fn_strokeWidth)
							.attr("fill", self._fn_fill)
							.attr("opacity", self._fn_opacity)

					
					}),
				exit => exit
					.call(self._fn_exit)
					.call(exit => {
            exit.transition(transition)
              .attr("cx", self._fn_cx)
              .attr("cy", self._fn_cy)
              .attr("r", 0)
							.attr("opacity", 0)
							.remove()
					}),
			)

		};
	
	}


	/**
	 *	@override
	 */
	drawCanvas(transition){
		super.drawCanvas(transition)

		let self = this;
		
		// clearing canvas
		//context.fillStyle = '#fff';
		//context.fillRect(0, 0, chart.size.width, chart.size.height);

		//context.lineJoin = "round";
		//context.lineCap = "round";

		const context = self._chart.group.node().getContext("2d")

		const fn_render = (d, i, nodes) => {

			const s = transition.duration() ? d3.select(nodes[i]) : null

			context.fillStyle = s ? s.attr("fill") : self._fn_fill(d, i)
			context.lineWidth = s ? s.attr("stroke-width") : self._fn_strokeWidth(d, i)
			context.strokeStyle = s ? s.attr("stroke") : self._fn_stroke(d, i)
			const cx = s ? s.attr("cx") : self._fn_cx(d, i)
			const cy = s ? s.attr("cy") : self._fn_cy(d, i)
			const r = s ? s.attr("r") : self._fn_radius(d, i)

			context.beginPath()
			context.arc(cx, cy, r, 0, 2 * Math.PI)
			context.fillStyle && context.fill()
			+context.lineWidth && context.stroke()
			context.closePath() 

		}

		if (transition.duration()) {
			const fn_interval = d3.interval(() => self._join.each(fn_render), transition.delay(), 50)
			transition.on("end.canvas interrupt.canvas", () => fn_interval.stop())
		} else {
			self._chart.data.forEach(fn_render)
		}

	}

	/**
	 *	@override
	 */
	draw(transition) {
		super.draw(transition);

		let self = this;

		self._group.classed("geo-circles", true);

		self._group
			.selectAll("circle")
			.data(self._chart.data.filter(self._fn_defined), self._chart.fn_key)
			.call(self._fn_draw, transition);
		
	}
}
