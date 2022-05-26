import pipe from "lodash/fp/flow";
import { select } from "d3-selection";

import component from "../../virtual/component/base/index";

import { getProxy } from "../../virtual/common/proxy";
import { hasBandOut } from "../../virtual/component/outs/band";
import { hasLowHighContOut } from "../../virtual/component/outs/cont";
import { hasMultiDrawFactory } from "../../virtual/component/properties/draw";

const byLines = (state = {}) => {
  const self = pipe(
    component,
    hasBandOut,
    hasLowHighContOut,
    hasMultiDrawFactory("line")
  )(state);

  self.fnBefore((s) =>
    s
      .attr("y1", self.fnBandCenterOut())
      .attr("x1", self.fnLowContOut())
      .attr("y2", self.fnBandCenterOut())
      .attr("x2", self.fnLowContOut())
      .attr("opacity", 0)
  );

  self.fnNow(
    (s) =>
      s
        .attr("y1", self.fnBandCenterOut())
        .attr("x1", self.fnLowContOut())
        .attr("y2", self.fnBandCenterOut())
        .attr("x2", self.fnHighContOut())
    // .attr('opacity', 1) // not needed
  );

  self.fnAfter((s) =>
    s
      .attr("x2", (d, i, nodes) => select(nodes[i]).attr("x1"))
      .attr("opacity", 0)
  );

  return getProxy(self);
};

export default byLines;
