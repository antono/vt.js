"use strict";

if (window) {
    window.VT = (typeof VT === 'undefined' ? {} : window.VT);
} else {
    var VT = {};
}

var Term = function() {
    this.model = 'Fake';
    this.canvas = "";
}

Term.prototype.print = function(chr) {
    this.canvas += chr;
}

exports.Term = Term;
