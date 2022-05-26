import pipe from "lodash/fp/flow";
import component from "../../virtual/component/base/index";

import { getProxy } from "../../virtual/common/proxy";
import { hasCircle } from "../../virtual/component/types/circle";
import { hasPolar } from "../../virtual/component/types/polar";
import { hasBandOut } from "../../virtual/component/outs/band";
import { hasContOut } from "../../virtual/component/outs/cont";
import { hasMultiDrawFactory } from "../../virtual/component/properties/draw";

const baBars = (state = {}) => {
  const self = pipe(
    component,
    hasCircle,
    hasPolar,
    hasBandOut,
    hasContOut,
    hasMultiDrawFactory("circle")
  )(state);

  self.fnBefore((s) =>
    s
      .each((d, i, nodes) => {
        nodes[i].beforePolar = {
          angle: self.fnBandCenterOut()(d, i),
          radius: self.fnContOut()(d, i),
        };
      })
      .attr("r", 0)
      .attr("opacity", 0)
  );

  self.fnNow((s) =>
    s
      .each((d, i, nodes) => {
        nodes[i].fromPolar =
          "toPolar" in nodes[i]
            ? { ...nodes[i].toPolar }
            : { ...nodes[i].beforePolar };
        nodes[i].toPolar = {
          angle: self.fnBandCenterOut()(d, i),
          radius: self.fnContOut()(d, i),
        };
      })
      .attrTween("cx", self.fnXTween())
      .attrTween("cy", self.fnYTween())
      .attr("r", self.fnRadius())
      .attr("opacity", self.fnOpacity())
  );

  self.fnAfter((s) => s.attr("r", 0).attr("opacity", 0));

  return getProxy(self);
};

export default baBars;
