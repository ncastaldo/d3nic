"use strict";
/*
 *
 *  Reusable tooltip.
 *
 */
export function tooltip(_div) {

    let div = _div;
    /*
     *  MAIN variables default values.
     */
    let maxWidth = 200,
        maxHeight = 100,
        hPadding = 10,
        vPadding = 10,
        pointerEvents = "none",
        innerPadding = 8,
        backgroundColor = "rgba(0, 0, 0, 0.8)",
        color = "white";

    /*
     *  Tooltip text variables default values.
     */
    let fn_key,
        titleFontSize = 15,
        fn_titleText = (d, i) => i, 
        values = ["value"],
        valuesFontSize = 12,
        fn_bodyText = (v, j, d, i) => Object.byString(d, v), 
        fn_color = (v, j, d, i) => d3.schemeCategory10[j],
        circleRadius = 6;

    /*
     *  The element.
     */
    let tooltip;

    /*
     *  CORE function.
     */
    function element(selection, i) {
        selection.on("mouseover.tooltip", d => {

            div.selectAll("div.d3nic-tooltip").remove()

            tooltip = div.append("div")
                .classed("d3nic-tooltip", true)
                .style("position", "absolute")
                .style("max-width", maxWidth)
                .style("max-height", maxHeight)
                .style("pointer-events", pointerEvents)
                .style("padding", innerPadding + "px")
                .style("background-color", backgroundColor)
                .style("left", d3.event.pageX + hPadding + "px")
                .style("top", d3.event.pageY + vPadding + "px")
                .style("color", color);

            tooltip.append("div")
                .classed("tooltip-title", true)
                .style("font-size", titleFontSize + "px")
                .text(fn_titleText(d, i))

            let tooltipBody = tooltip.append("div")
                .classed("tooltip-body", true)

            let fn_initTooltipBodyRow = function(selection){
                selection.each(function(v, j){
                    let tmp = d3.select(this)

                    if(fn_color)
                        tmp.append("div")
                            .style("width", circleRadius*2 + "px")
                            .style("height", circleRadius*2 + "px")
                            .style("margin-right", circleRadius + "px")
                            .style("border-radius", "50%")
                            .style("background-color", fn_color(v, j, d, i))

                    tmp.append("div")
                        .text(fn_bodyText(v, j, d, i))
                })
            }

            tooltipBody.selectAll("div")
                .data(values)
                .enter()
                .append("div")
                .style("font-size", valuesFontSize + "px")
                .style("display", "flex")
                .style("flex-direction", "row")
                .style("align-items", "center")
                .call(fn_initTooltipBodyRow)

            })
            .on("mousemove.tooltip", () => {
                tooltip
                    .style("left", d3.event.pageX + hPadding + "px")
                    .style("top", d3.event.pageY + vPadding + "px")
            })
            .on("mouseout.tooltip remove", () => {
                if(tooltip) tooltip.remove()
            });
    }

    element.fn_key = function(value) {
        if (!arguments.length) return fn_key;
        fn_key = value;
        return element;
    };

    element.values = function(value) {
        if (!arguments.length) return values;
        values = value;
        return element;
    };

    element.fn_titleText = function(value) {
        if (!arguments.length) return fn_titleText;
        fn_titleText = value;
        return element;
    }

    element.fn_bodyText = function(value) {
        if (!arguments.length) return fn_bodyText;
        fn_bodyText = value;
        return element;
    }

    element.fn_color = function(value) {
        if (!arguments.length) return fn_color;
        fn_color = value;
        return element;
    }

    return element;

}
