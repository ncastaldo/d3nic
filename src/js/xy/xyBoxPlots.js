import * as d3 from "d3";
import Component from '../component.js'

export default class XyBoxPlots extends Component {
	constructor(params = {}) {
		super(params);

		let self = this;

    self._fn_minValue = params.fn_minValue || ((d, i) => d)
    self._fn_q1Value = params.fn_q1Value || ((d, i) => d)
    self._fn_medianValue = params.fn_medianValue || ((d, i) => d)
    self._fn_q3Value = params.fn_q3Value || ((d, i) => d)
    self._fn_maxValue = params.fn_maxValue || ((d, i) => d)

		self._fn_valueDomain = (d, i) => d3.extent([
			self._fn_maxValue(d, i),
      self._fn_q1Value(d, i),
      self._fn_medianValue(d, i),
      self._fn_q3Value(d, i),
      self._fn_minValue(d, i)
		])
	}

	/**
	 *	@override
	 */
	set chart(chart) {
		super.chart = chart;

		let self = this;

    const fn_x = (d, i) => chart.fn_xScale(chart.fn_key(d, i))
    const fn_width = (d, i) => chart.fn_xScale.bandwidth();

    const fn_yMin = (d, i) => chart.fn_yScale(self._fn_minValue(d, i));
    const fn_yQ1 = (d, i) => chart.fn_yScale(self._fn_q1Value(d, i));
    const fn_yMedian = (d, i) => chart.fn_yScale(self._fn_medianValue(d, i));
    const fn_yQ3 = (d, i) => chart.fn_yScale(self._fn_q3Value(d, i));
    const fn_yMax = (d, i) => chart.fn_yScale(self._fn_maxValue(d, i));
    
    const fn_height = (d, i) => fn_yQ1(d, i) - fn_yQ3(d, i);

    const enterRect = (enter, transition) => 
      enter
        .append("rect")
        .attr("x", fn_x)
        .attr("width", fn_width)
        .attr("y", fn_yMedian)
        .attr("height", 0)
        .transition(transition)
        .attr("y", fn_yQ3)
        .attr("height", fn_height)
    const updateRect = (update, transition) =>             
      update
        .select("rect")
        .transition(transition)
        .attr("x", fn_x)
        .attr("width", fn_width)
        .attr("y", fn_yQ3)
        .attr("height", fn_height)
    const exitRect = (exit, transition) =>       
      exit
        .select("rect")
        .transition(transition)
        .attr("y", fn_yMedian)
        .attr("height", 0)

		self._fn_draw = (boxPlots, transition) => {
			self._join = boxPlots.join(
				enter => enter
          .append("g")
          .classed("box-plot", true)
          .attr("stroke", self._fn_stroke)
          .attr("stroke-width", self._fn_strokeWidth)
          .attr("fill", self._fn_fill)
          .attr("opacity", 0)
          .call(enterRect, transition)
          .call(enter => enter
            .transition(transition)
            .attr("opacity", self._fn_opacity)),
        update => update
          .call(updateRect, transition),
        exit =>	exit
          .call(exitRect, transition)
          .call(exit => exit
            .transition(transition)
            .attr("opacity", 0)
				    .remove())
			);
		};
	}

	/**
	 *	@override
	 */
	draw(transition) {
		super.draw(transition);

		let self = this;

		self._group.classed("xy-box-plots", true);

		self._group
			.selectAll("g.xy-box-plot")
			.data(self._chart.data.filter(self._fn_defined), self._chart.fn_key)
			.call(self._fn_draw, transition);
	}
}
