const hasText = (state = {}) => {
  let fnText = (d, i) => d;
  let fnFontSize = (d, i) => 10;

  let textPadding = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  };

  const self = {
    ...state,
    fnText(value) {
      if (typeof value === "undefined") return fnText;
      fnText = value;
    },
    fnFontSize(value) {
      if (typeof value === "undefined") return fnFontSize;
      fnFontSize = value;
    },
    textPadding(value) {
      if (typeof value === "undefined") return textPadding;
      textPadding = { ...textPadding, ...value };
    },
  };

  return self;
};

export { hasText };
