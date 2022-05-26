import pipe from "lodash/fp/flow";

const hasDefined = (state = {}) => {
  let fnDefined = (d) => true;

  const self = {
    ...state,
    fnDefined(value) {
      if (typeof value === "undefined") return fnDefined;
      fnDefined = value;
    },
  };

  return self;
};

const hasValue = (state = {}) => {
  let fnValue = (d) => d;

  const self = {
    ...state,
    ...pipe(hasDefined)(state),
    fnsValue(value) {
      if (typeof value === "undefined") return [fnValue];
      fnValue = value[0];
    },
    fnValue(value) {
      if (typeof value === "undefined") return fnValue;
      fnValue = value;
    },
  };

  return self;
};

const hasLowHighValue = (state = {}) => {
  let fnLowValue = (d) => 0;
  let fnHighValue = (d) => d;

  const self = {
    ...state,
    ...pipe(hasDefined)(state),
    fnsValue(value) {
      if (typeof value === "undefined") return [fnLowValue, fnHighValue];
      fnLowValue = value[0];
      fnHighValue = value[1];
    },
    fnLowValue(value) {
      if (typeof value === "undefined") return fnLowValue;
      fnLowValue = value;
    },
    fnHighValue(value) {
      if (typeof value === "undefined") return fnHighValue;
      fnHighValue = value;
    },
  };

  return self;
};

export { hasValue, hasLowHighValue };
