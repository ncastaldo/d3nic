import pipe from "lodash/fp/flow";
import component from "../../virtual/component/base/index";

import { select } from "d3-selection";

import { getProxy } from "../../virtual/common/proxy";
import { hasBandOut } from "../../virtual/component/outs/band";
import { hasLowHighContOut } from "../../virtual/component/outs/cont";
import { hasMultiDrawFactory } from "../../virtual/component/properties/draw";

const bxBars = (state = {}) => {
  const self = pipe(
    component,
    hasBandOut,
    hasLowHighContOut,
    hasMultiDrawFactory("rect")
  )(state);

  self.fnBefore((s) =>
    s
      .attr("x", self.fnBandOut())
      .attr("width", self.bandwidthOut())
      .attr("y", self.fnLowContOut())
      .attr("height", 0)
      .attr("opacity", 0)
  );

  self.fnNow(
    (s) =>
      s
        .attr("x", self.fnBandOut())
        .attr("width", self.bandwidthOut())
        .attr("y", (d, i) =>
          Math.min(self.fnHighContOut()(d, i), self.fnLowContOut()(d, i))
        )
        .attr("height", (d, i) =>
          Math.abs(self.fnLowContOut()(d, i) - self.fnHighContOut()(d, i))
        )
    // .attr('opacity', 1) // not needed
  );

  self.fnAfter((s) =>
    s
      .attr(
        "y",
        (d, i, nodes) =>
          +select(nodes[i]).attr("y") + +select(nodes[i]).attr("height")
      )
      .attr("height", 0)
      .attr("opacity", 0)
  );

  return getProxy(self);
};

export default bxBars;
