import * as d3 from "d3";


/**
 * GOLDEN RULE!
 * In order to stop an exit transition and make it work correctly, the join.update
 * part whould operate on the attributes that are modified by the exit phase!
 */

/* ------------------------------------------------------ */
/* ------------------------------------------------------ */
/* ------------------------------------------------------ */

// https://github.com/wbkd/d3-extended
d3.selection.prototype.moveToFront = function() {
	return this.each(function() {
		this.parentNode.appendChild(this);
	});
};

d3.selection.prototype.moveToBack = function() {
	return this.each(function() {
		let firstChild = this.parentNode.firstChild;
		if (firstChild) {
			this.parentNode.insertBefore(this, firstChild);
		}
	});
};


// first argument is topic (function or string)
// other arguments are a list of callbacks
d3.selection.prototype.subscribe = function(topic, fn_callback) {
    return this.each(function() {
        const t = (typeof topic === "function" ? topic.apply(this, arguments) : topic)
        const token = PubSub.subscribe(t, (msg, data) => {
            fn_callback(d3.select(this), msg, data, arguments[0], arguments[1], arguments[2]) // arguments[0], arguments[1], arguments[2]: d, i, nodes
        })
        d3.select(this).on("remove." + token, () => PubSub.unsubscribe(token))
    })
};




/* ------------------------------------------------------ */
/* ------------------------------------------------------ */
/* ------------------------------------------------------ */

const fn_transition = (selection, name, duration) => {
    if (selection.node() == null) return selection;
    const active = d3.active(selection.node()) // if you give names to other transitions consider put it here
    return active && active.name !== name ? 
        d3.select(null) : 
        duration !== undefined && duration === 0 ? // check on this check...
            selection :
            selection.transition(name).duration(duration || 250)
}

const fn_arcRadius = (outer, toRadius) => d => 
    d3.arc()
        .innerRadius(outer ? d.innerRadius : toRadius)
        .outerRadius(outer ? toRadius : d.outerRadius)(d)


// to call more than one in a row and have a smooth transition that comprehends all of them, put 0-duration in all but the last one

const sb_strokeWidth = (strokeWidth, duration) => s => 
    fn_transition(s, "stroke-width", duration).attr("stroke-width", strokeWidth)

const sb_stroke = (stroke, duration) => s => 
    fn_transition(s, "stroke", duration).attr("stroke", stroke)

const sb_opacity = (opacity, duration) => s => 
    fn_transition(s, "opacity", duration).attr("opacity", opacity)

const sb_arcOuterRadius = (toRadius, duration) => s => 
    fn_transition(s, "arc-outer-radius", duration).attr("d", fn_arcRadius(true, toRadius))

const sb_arcInnerRadius = (toRadius, duration) => s => 
    fn_transition(s, "arc-inner-radius", duration).attr("d", fn_arcRadius(false, toRadius))

const sb_fontSize = (fontSize, duration) => s => 
    fn_transition(s, "font-size", duration).attr("font-size", fontSize)



/* ------------------------------------------------------ */
/* ------------------------------------------------------ */
/* ------------------------------------------------------ */

/*
 *  Modyfing d3 source code to send the "remove" event when object is removed.
 *  Attention! Tree removal is not treated here, but only selection and transition.
 */

/*
 *  This function dispatches the "remove" event
 */
function removeDispatcher(node) {
    d3.select(node).dispatch("remove");
}

/*
 *  Modifying the SELECTION part of d3.
 */
function remove() {
    removeDispatcher(this);
    var parent = this.parentNode;
    if (parent) parent.removeChild(this);
}

d3.selection.prototype.remove = function() {
    return this.each(remove);
};

/*
 *  Modifying the TRANSITION part of d3.
 */
function removeFunction(id) {
    return function() {
        removeDispatcher(this);
        var parent = this.parentNode;
        for (var i in this.__transition) if (+i !== id) return;
        if (parent) parent.removeChild(this);
    };
}

d3.transition.prototype.remove = function() {
    return this.on("end.remove", removeFunction(this._id));
};


/* ------------------------------------------------------ */
/* ---------------------- DEPRECATED -------------------- */
/* ------------------------------------------------------ */

// https://stackoverflow.com/questions/6491463/accessing-nested-javascript-objects-with-string-key
Object.byString = function(o, s) {
    s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, '');           // strip a leading dot
    var a = s.split('.');
    for (var i = 0, n = a.length; i < n; ++i) {
        var k = a[i];
        if (k in o) {
            o = o[k];
        } else {
            return;
        }
    }
    return o;
}

