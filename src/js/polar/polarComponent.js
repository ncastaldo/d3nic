import * as d3 from '@/js/d3-modules.js';
import Component from '@/js/component.js'

export default class PolarComponent extends Component {
	constructor(params = {}) {
		super(params)

		let self = this;

		self._fn_arcTween = (d, i, nodes) => {
			const selection = d3.select(nodes[i])
			const fn_interpolate = d3.interpolate(
				{ 
					startAngle: selection.attr("startAngleInitial"),
					endAngle: selection.attr("endAngleInitial"),
					innerRadius: selection.attr("innerRadiusInitial"),
					outerRadius: selection.attr("outerRadiusInitial"),
				}, 
				{
					startAngle: selection.attr("startAngle"),
					endAngle: selection.attr("endAngle"),
					innerRadius: selection.attr("innerRadius"),
					outerRadius: selection.attr("outerRadius"),
				});
			return t => d3.arc()(fn_interpolate(t))
		}
	}

}
