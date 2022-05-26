import pipe from "lodash/fp/flow";

import { getProxy } from "../../virtual/common/proxy";
import chart from "../../virtual/chart/base/index";
import { hasPolar } from "../../virtual/chart/types/polar";
import { hasDoubleContScaleFactory } from "../../virtual/chart/properties/scales";

const arChart = (state = {}) => {
  const self = pipe(
    chart,
    hasPolar,
    hasDoubleContScaleFactory(["angle", "radius"])
  )(state);

  return getProxy(self);
};

export default arChart;
