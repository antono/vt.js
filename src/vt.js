var VT = {};

VT.Parser = function(callback) {
    this.state = 0;
    this.numIntermediateChars = 0;
    this.numParams = 0;
    this.ignoreFlagged = 0;
    this.callback = callback; // Callback signature (parser, action, char)
}

exports.VT = VT;
