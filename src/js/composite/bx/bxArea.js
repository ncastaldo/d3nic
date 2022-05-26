import pipe from "lodash/fp/flow";
import { area } from "d3-shape";

import component from "../../virtual/component/base/index";

import { getProxy } from "../../virtual/common/proxy";
import { hasBandOut } from "../../virtual/component/outs/band";
import { hasLowHighContOut } from "../../virtual/component/outs/cont";
import { hasSingleDrawFactory } from "../../virtual/component/properties/draw";

const bxArea = (state = {}) => {
  const self = pipe(
    component,
    hasBandOut,
    hasLowHighContOut,
    hasSingleDrawFactory("path")
  )(state);

  self.fnBefore((s) =>
    s
      .attr(
        "d",
        area()
          .defined(self.fnDefined())
          .x(self.fnBandCenterOut())
          .y0(self.fnLowContOut())
          .y1(self.fnHighContOut())
      )
      .attr("opacity", 0)
  );

  self.fnNow((s) =>
    s.attr(
      "d",
      area()
        .defined(self.fnDefined())
        .x(self.fnBandCenterOut())
        .y0(self.fnLowContOut())
        .y1(self.fnHighContOut())
    )
  );

  self.fnAfter((s) => s.attr("opacity", 0));

  return getProxy(self);
};

export default bxArea;
