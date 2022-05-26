const hasDoubleBandOut = (state = {}) => {
  let fnDoubleBandOut;
  let fnDoubleBandCenterOut;

  let doubleBandwidthOut;

  let fnDoubleBandLeftOut;
  let fnDoubleBandRightOut;

  const self = {
    ...state,
    fnDoubleBandOut() {
      return fnDoubleBandOut;
    },
    fnDoubleBandCenterOut() {
      return fnDoubleBandCenterOut;
    },
    doubleBandwidthOut() {
      return doubleBandwidthOut;
    },
    fnDoubleBandLeftOut() {
      return fnDoubleBandLeftOut;
    },
    fnDoubleBandRightOut() {
      return fnDoubleBandRightOut;
    },
  };

  const updateOuts = (chart) => {
    const fnDoubleBandScales = chart.fnDoubleBandScale();

    fnDoubleBandOut = (k) => (d, i) =>
      fnDoubleBandScales[k](chart.fnDoubleBandValue()(d, i)[k]);

    fnDoubleBandCenterOut = (k) => (d, i) =>
      fnDoubleBandScales[k](chart.fnDoubleBandValue()(d, i)[k]) +
      fnDoubleBandScales[k].bandwidth() / 2;
    doubleBandwidthOut = (k) => fnDoubleBandScales[k].bandwidth();

    fnDoubleBandLeftOut = (k) => (d, i) =>
      Math.max(
        fnDoubleBandScales[k].range()[0],
        fnDoubleBandOut(k)(d, i) -
          (fnDoubleBandScales[k].step() *
            fnDoubleBandScales[k].paddingInner()) /
            2
      );
    fnDoubleBandRightOut = (k) => (d, i) =>
      Math.min(
        fnDoubleBandOut(k)(d, i) +
          doubleBandwidthOut(k) +
          (fnDoubleBandScales[k].step() *
            fnDoubleBandScales[k].paddingInner()) /
            2,
        fnDoubleBandScales[k].range()[1]
      );
  };

  self.subscribe("draw", updateOuts);

  return self;
};

export { hasDoubleBandOut };
