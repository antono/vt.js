"use strict;"

// VT.Parser - an implementation of Paul Williams' DEC compatible state machine parser
// http://vt100.net/emu/dec_ansi_parser

var Parser = function(callback) {
    this.state = 'GROUND';
    this.numIntermediateChars = 0;
    this.numParams = 0;
    this.ignoreFlagged = 0;
    this.callback = callback; // Callback signature (parser, action, char)
}

// Action Definitions
// http://vt100.net/emu/dec_ansi_parser#ACTIONS
Parser.actions = {
    ignore: function(chr) {
        console.log("ACTION: ignore: " + chr)
    },

    print: function(chr) {
        console.log(chr);
    },

    execute: function(chr) {
        console.log(chr);
    },

    clear: function(chr) {
        console.log(chr);
    },

    collect: function(chr) {
        console.log(chr);
    },

    param: function(chr) {
        console.log(chr);
    },

    esc_dispatch: function(chr) {
        console.log(chr);
    },

    csi_dispatch: function(chr) {
        console.log(chr);
    },

    hook: function(chr) {
        console.log(chr);
    },

    put: function(chr) {
        console.log(chr);
    },

    unhook: function(chr) {
        console.log(chr);
    },

    osc_start: function(chr) {
        console.log(chr);
    },

    osc_put: function(chr) {
        console.log(chr);
    },

    osc_end: function(chr) {
        console.log(chr);
    }
}

// State Definitions
// http://vt100.net/emu/dec_ansi_parser#STATES
Parser.transitions = require('./transitions');

// Changes state of parser:
//
// 1. exit action from old state
// 2. transition action
// 3. entry action to new state
//
Parser.prototype.changeState = function(newState) {
    console.log("Changing State to: " + newState);
    var exitFun = Parser.transitions[this.state].exit;
    if (exitFun) Parser.actions[exitFun]();
    this.state = newState;
    var entryFun = Parser.transitions[newState].exit;
    if (entryFun) Parser.actions[entryFun]();
}

Parser.prototype.pushChars = function(string) {
    if (string === undefined || string === "") return;
    for (var i = 0; i < string.length; i++) {
        this.pushChar(string[i]);
    }
}

Parser.prototype.pushChar = function(chr) {
    if (chr === undefined) return;

    var actions;
    var charCode = chr.charCodeAt(0);

    console.log('Got char: ' + chr)
    console.log('Current State: ' + this.state)

    actions = Parser.transitions['ANYWHERE'][charCode] || Parser.transitions[this.state][charCode];

    console.log(actions)
    
    if (actions[0]) {
        Parser.actions[actions[0]](chr);
    }

    if (actions[1]) {
        this.changeState(actions[1]);
    }
}

exports.Parser = Parser;
