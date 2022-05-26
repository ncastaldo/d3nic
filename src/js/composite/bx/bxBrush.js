import pipe from "lodash/fp/flow";
import component from "../../virtual/component/base/index";

import { getProxy } from "../../virtual/common/proxy";
import { hasBandBrushFactory } from "../../virtual/component/types/brush";
import { hasBandOut } from "../../virtual/component/outs/band";
import { hasSingleFunctionDraw } from "../../virtual/component/properties/draw";

const bxBrush = (state = {}) => {
  const self = pipe(
    component,
    hasBandOut,
    hasBandBrushFactory("x"),
    hasSingleFunctionDraw
  )(state);

  self.fnBefore((s) => s.call(self.fnBrush()));

  self.fnNow((s) =>
    s
      .attr("opacity", 1)
      .call((t) => self.snap({ duration: t.duration(), delay: t.delay() }))
  );

  return getProxy(self);
};

export default bxBrush;
