import pipe from "lodash/fp/flow";

import component from "../../virtual/component/base/index";

import { hasPolar } from "../../virtual/component/types/polar";
import { hasBandOut } from "../../virtual/component/outs/band";
import { hasContOut } from "../../virtual/component/outs/cont";
import { hasSingleDrawFactory } from "../../virtual/component/properties/draw";

import { getProxy } from "../../virtual/common/proxy";

const baCircle = (state = {}) => {
  const self = pipe(
    component,
    hasPolar,
    hasBandOut,
    hasContOut,
    hasSingleDrawFactory("circle")
  )(state);

  self.fnBefore((s) =>
    s.attr("cx", 0).attr("cy", 0).attr("r", self.fnContOut()).attr("opacity", 0)
  );

  self.fnNow((s) => s.attr("opacity", self.fnOpacity()));

  self.fnAfter((s) => s.attr("opacity", 0));

  return getProxy(self);
};

export default baCircle;
