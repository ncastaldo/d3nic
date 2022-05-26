import pipe from "lodash/fp/flow";
import component from "../../virtual/component/base/index";

import { mean, min } from "d3-array";

import { getProxy } from "../../virtual/common/proxy";
import { hasText } from "../../virtual/component/types/text";
import { hasAxisFactory } from "../../virtual/component/types/axis";
import { hasSingleDrawFactory } from "../../virtual/component/properties/draw";

const labelAxisY = (state = {}) => {
  const self = pipe(
    component,
    hasText,
    hasAxisFactory("y"), // simple axis, no overhead here
    hasSingleDrawFactory("text")
  )(state);

  const getTransform = (self) => {
    const x = min(self.extent(), (v) => v[0]) - self.textPadding().right;
    const y = mean(self.extent(), (v) => v[1]);
    return `translate(${x},${y}) rotate(-90)`;
  };

  self.fnBefore((s) =>
    s
      .attr("transform", getTransform(self))
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .attr("font-size", self.fnFontSize())
      .text(self.fnText())
      .attr("opacity", 0)
  );

  self.fnNow((s) =>
    s
      .attr("transform", getTransform(self))
      .text(self.fnText())
      .attr("opacity", 1)
  );

  self.fnAfter((s) => s.attr("opacity", 0));

  return getProxy(self);
};

export default labelAxisY;
