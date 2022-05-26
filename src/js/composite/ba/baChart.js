import pipe from "lodash/fp/flow";

import { getProxy } from "../../virtual/common/proxy";
import chart from "../../virtual/chart/base/index";
import { hasPolar } from "../../virtual/chart/types/polar";
import {
  hasBandScaleFactory,
  hasContScaleFactory,
} from "../../virtual/chart/properties/scales";

const baChart = (state = {}) => {
  const self = pipe(
    chart,
    hasPolar,
    hasBandScaleFactory("angle"),
    hasContScaleFactory("radius")
  )(state);

  return getProxy(self);
};

export default baChart;
