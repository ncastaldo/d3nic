
import component from '../base/component'

const bxBars = () => {
  const fnDraw = (fnDraw, transition) => {
    const join = fnDraw.join(
      enter => enter
        .append('rect')
        .attr('x', d => d)
        .attr('width', d => d + 20)
        .attr('y', d => d)
        .attr('height', d => d + 30),
      update => update
        .call(update =>
          update.transition(transition)
            .attr('x', d => d)
            .attr('width', d => d + 20)
            .attr('y', d => d)
            .attr('height', d => d + 30)
        )
    )
    self.join(join)
  }

  const draw = (chart) => {
    self.group()
      .classed('bxBars', true)
      .selectAll('rect')
      .data(chart.data(), chart.fnKey())
      .call(fnDraw, chart.transition())
  }

  const self = {
    ...component()
  }

  self.subscribe('draw', draw)

  return self
}

export default bxBars
