"use strict;"

// VT.Parser - an implementation of Paul Williams' DEC compatible state machine parser
// http://vt100.net/emu/dec_ansi_parser

var Parser = function(callback) {
    this.state = 0;
    this.numIntermediateChars = 0;
    this.numParams = 0;
    this.ignoreFlagged = 0;
    this.callback = callback; // Callback signature (parser, action, char)
}


// Action Definitions: http://vt100.net/emu/dec_ansi_parser#ACTIONS
Parser.actions = {
    ignore: function() {
        console.log();
    },

    print: function() {
        console.log();
    },

    execute: function() {
        console.log();
    },

    clear: function() {
        console.log();
    },

    collect: function() {
        console.log();
    },

    param: function() {
        console.log();
    },

    escDispatch: function() {
        console.log();
    },

    csiDispatch: function() {
        console.log();
    },

    hook: function() {
        console.log();
    },

    put: function() {
        console.log();
    },

    unhook: function() {
        console.log();
    },

    oscStart: function() {
        console.log();
    },

    oscPut: function() {
        console.log();
    },

    oscEnd: function() {
        console.log();
    }
}

// State Definitions: http://vt100.net/emu/dec_ansi_parser#STATES
Parser.states = {
    GROUND: {
    },
    ESCAPE: {
        entry: Parser.actions.clear
    },
    ESCAPE_INTERMEDIATE: {
    },
    CSI_ENTRY: {
        entry: Parser.actions.clear
    },
    CSI_PARAM: {
    },
    CSI_INTERMEDIATE: {
    },
    CSI_IGNORE: {
    },
    DCS_ENTRY: {
        entry: Parser.actions.clear
    },
    DCS_PARAM: {
    },
    DCS_INTERMEDIATE: {
    },
    DCS_PASSTHROUGH: {
        entry: Parser.actions.hook,
        exit:  Parser.actions.unhook,
    },
    DCS_IGNORE: {
    },
    OSC_STRING: {
        entry: Parser.actions.oscStart,
        exit:  Parser.actions.oscEnd,
    },
    SOS_PM_APC_STRING: {
    },
    ANYWHERE: {
    }
}

Parser.prototype.stateChange = function(newState) {
    var exitFun  = Parser.states[this.state].exit;
    var entryFun = Parser.states[newState].exit;
    this.state = newState;
}

exports.Parser = Parser;
