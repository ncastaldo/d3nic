import pipe from "lodash/fp/flow";
import { select } from "d3-selection";

const hasDraw = (state) => {
  let join = select(null);

  let fnBefore = (s) => s;
  let fnNow = (s) => s;
  let fnAfter = (s) => s;

  const self = {
    ...state,
    join(value) {
      if (typeof value === "undefined") return join;
      join = value;
    },
    fnBefore(value) {
      if (typeof value === "undefined") return fnBefore;
      fnBefore = pipe(fnBefore, value);
    },
    fnNow(value) {
      if (typeof value === "undefined") return fnNow;
      fnNow = pipe(fnNow, value);
    },
    fnAfter(value) {
      if (typeof value === "undefined") return fnAfter;
      fnAfter = pipe(fnAfter, value);
    },
  };

  return self;
};

const hasPhi = (state) => {
  let phi = 0.2;

  const fnPhiTransition = (selection, transition) => {
    if (!selection.empty()) {
      return selection
        .transition(transition)
        .duration(transition.duration() * (1 - phi))
        .delay((_, i, nodes) => {
          return (
            transition.delay() +
            (nodes.length > 1
              ? (i / (nodes.length - 1)) * transition.duration() * phi
              : 0)
          );
        });
    }
    return selection.transition(transition);
  };

  const self = {
    ...state,
    phi(value) {
      if (typeof value === "undefined") return phi;
      phi = value;
    },
    fnPhiTransition: () => fnPhiTransition,
  };

  return self;
};

const hasSingleFunctionDraw = (state) => {
  const self = {
    ...state,
    ...pipe(hasDraw)(state),
  };

  const fnDraw = (s, chart) => {
    const firstDraw = !s.classed("drawn");

    // remove old element if exists
    firstDraw
      ? s
          .call(self.fnEvents())
          .call(self.fnStyle())
          .call(self.fnBefore())
          .classed("drawn", true)
          .transition(chart.transition())
          .call(self.fnNow())
      : s.transition(chart.transition()).call(self.fnNow());
  };

  const draw = (chart) => {
    self.group().call(fnDraw, chart);

    // joining the group inself
    self.join().empty() && self.join(self.group());
  };

  self.subscribe("draw", draw);

  return self;
};

const hasSingleDrawFactory = (element) => (state) => {
  const self = {
    ...state,
    ...pipe(hasDraw)(state),
  };

  const fnDraw = (s, chart) => {
    const oldElement = s.selectAll(`${element}.drawn`);

    // remove old element if exists
    if (!oldElement.empty()) {
      oldElement.transition(chart.transition()).call(self.fnAfter()).remove();
    }

    const join = s
      .datum(chart.data()) // not filtered for fnDefined
      .append(element)
      .call(self.fnEvents())
      .call(self.fnStyle())
      .call(self.fnBefore())
      .classed("drawn", true);

    // breaking the scheme in order to have the selection
    // and not the transition for variable 'join'
    join.transition(chart.transition()).call(self.fnStyle()).call(self.fnNow());

    // joining the selection
    self.join(join);
  };

  const draw = (chart) => {
    self.group().call(fnDraw, chart);
  };

  self.subscribe("draw", draw);

  return self;
};

const hasMultiDrawFactory = (element) => (state) => {
  const self = {
    ...state,
    ...pipe(hasDraw, hasPhi)(state),
  };

  const fnDraw = (s, chart) => {
    const join = s.join(
      (enter) =>
        enter
          .append(element)
          .call(self.fnEvents())
          .call(self.fnStyle())
          .call(self.fnBefore())
          .call((enter) =>
            self
              .fnPhiTransition()(enter, chart.transition())
              .call(self.fnStyle())
              .call(self.fnNow())
          ),
      (update) =>
        update.call((update) =>
          self
            .fnPhiTransition()(update, chart.transition())
            .call(self.fnStyle())
            .call(self.fnNow())
        ),
      (exit) =>
        exit.call((exit) =>
          self
            .fnPhiTransition()(exit, chart.transition())
            .call(self.fnAfter())
            .remove()
        )
    );
    self.join(join);
  };

  // charts whose fnKey is (d, i) => i will suffer fnDefined translations
  const draw = (chart) => {
    self
      .group()
      .selectAll(element)
      .data(
        chart
          .data()
          .filter((d, i) =>
            "fnDefined" in self ? self.fnDefined()(d, i) : true
          ),
        chart.fnKey()
      )
      .call(fnDraw, chart);
  };

  self.subscribe("draw", draw);

  return self;
};

export { hasSingleFunctionDraw, hasSingleDrawFactory, hasMultiDrawFactory };
