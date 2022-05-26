import { geoPath } from "d3-geo";
import pipe from "lodash/fp/flow";

import { hasValue } from "../properties/values";

const hasGeoOut = (state = {}) => {
  let fnGeoOut;
  const fnGeoPath = geoPath();

  const self = {
    ...state,
    ...pipe(hasValue)(state),
    fnGeoPath() {
      return fnGeoPath;
    },
    fnGeoOut(value) {
      if (typeof value === "undefined") return fnGeoOut;
      fnGeoOut = value;
    },
  };

  const updateOuts = (chart) => {
    fnGeoPath.projection(chart.fnGeoProjection());
    fnGeoOut =
      typeof self.fnValue() === "function"
        ? (d, i) => fnGeoPath(self.fnValue()(d, i))
        : () => fnGeoPath(self.fnValue());
  };

  self.subscribe("draw", updateOuts);

  return self;
};

export { hasGeoOut };
