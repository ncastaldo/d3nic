import pipe from "lodash/fp/flow";
import component from "../../virtual/component/base/index";

import { getProxy } from "../../virtual/common/proxy";
import { hasPolar } from "../../virtual/component/types/polar";
import { hasBandOut } from "../../virtual/component/outs/band";
import { hasRangeContOut } from "../../virtual/component/outs/cont";
import { hasMultiDrawFactory } from "../../virtual/component/properties/draw";

const brMouseBars = (state = {}) => {
  const self = pipe(
    component,
    hasPolar,
    hasBandOut,
    hasRangeContOut,
    hasMultiDrawFactory("path")
  )(state);

  self.fnOpacity(0);

  self.fnNow((t) =>
    t.selection().attrTween("d", (d, i) =>
      self.fnArc()({
        innerRadius: self.fnBandLeftOut()(d, i),
        outerRadius: self.fnBandRightOut()(d, i),
        startAngle: self.rangeContOut()[0],
        endAngle: self.rangeContOut()[1],
      })
    )
  );

  return getProxy(self);
};

export default brMouseBars;
