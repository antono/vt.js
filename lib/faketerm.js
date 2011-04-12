var Term = function() {
    this.model = 'Fake';
    this.canvas = "";
}

Term.prototype.print = function(chr) {
    this.canvas += chr;
}

exports.Term = Term;
