import pipe from "lodash/fp/flow";
import component from "../../virtual/component/base/index";

import { getProxy } from "../../virtual/common/proxy";
import { hasPolar } from "../../virtual/component/types/polar";
import { hasBandOut } from "../../virtual/component/outs/band";
import { hasLowHighContOut } from "../../virtual/component/outs/cont";
import { hasMultiDrawFactory } from "../../virtual/component/properties/draw";

const baBars = (state = {}) => {
  const self = pipe(
    component,
    hasPolar,
    hasBandOut,
    hasLowHighContOut,
    hasMultiDrawFactory("path")
  )(state);

  self.fnBefore((s) =>
    s
      .each((d, i, nodes) => {
        nodes[i].beforeArc = {
          startAngle: self.fnBandOut()(d, i),
          endAngle: self.fnBandOut()(d, i) + self.bandwidthOut(),
          innerRadius: self.fnLowContOut()(d, i),
          outerRadius: self.fnLowContOut()(d, i),
        };
      })
      .attr("opacity", 0)
  );

  self.fnNow((s) =>
    s
      .each((d, i, nodes) => {
        nodes[i].fromArc =
          "toArc" in nodes[i]
            ? { ...nodes[i].toArc }
            : { ...nodes[i].beforeArc };
        nodes[i].toArc = {
          startAngle: self.fnBandOut()(d, i),
          endAngle: self.fnBandOut()(d, i) + self.bandwidthOut(),
          innerRadius: self.fnLowContOut()(d, i),
          outerRadius: self.fnHighContOut()(d, i),
        };
      })
      .attrTween("d", self.fnArcTween())
  );

  self.fnAfter((s) =>
    s
      .each((d, i, nodes) => {
        // just to be consistent
        nodes[i].fromArc = { ...nodes[i].toArc };
        nodes[i].toArc = { ...nodes[i].beforeArc };
      })
      .attrTween("d", self.fnArcTween())
      .attr("opacity", 0)
  );

  return getProxy(self);
};

export default baBars;
