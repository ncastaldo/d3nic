import pipe from "lodash/fp/flow";
import component from "../../virtual/component/base/index";

import { getProxy } from "../../virtual/common/proxy";
import { hasBandAxisFactory } from "../../virtual/component/types/axis";
import { hasSingleFunctionDraw } from "../../virtual/component/properties/draw";

const byAxisY = (state = {}) => {
  const self = pipe(
    component,
    hasBandAxisFactory("y"),
    hasSingleFunctionDraw
  )(state);

  self.fnBefore((s) =>
    s
      .attr("transform", self.translateAxis())
      .call(self.fnAxis())
      .attr("opacity", 0)
  );

  self.fnNow((s) =>
    s
      .attr("transform", self.translateAxis())
      .call(self.fnAxis())
      .attr("opacity", 1)
  );

  self.fnAfter((s) => s.attr("opacity", 0));

  return getProxy(self);
};

export default byAxisY;
