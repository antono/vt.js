"use strict;"

// VT.Parser - an implementation of Paul Williams' DEC compatible state machine parser
// http://vt100.net/emu/dec_ansi_parser

var Parser = function(callback, enableDebug) {
    this.MAX_INTERMEDIATE_CHARS = 2;
    this.numIntermediateChars = 0;
    this.intermediateChars = [];
    this.params = [];
    this.state = 'GROUND';
    this.numParams = 0;
    this.ignoreFlagged = false;
    this.debug = enableDebug;

    var parser = this;
    this.callback = function(action,chr) {
        callback(parser, action, chr);
    }
}

// State Definitions
// http://vt100.net/emu/dec_ansi_parser#STATES
Parser.transitions = require('./transitions');

// Action Handling
// http://vt100.net/emu/dec_ansi_parser#ACTIONS
Parser.prototype.handleAction = function(action, chr) {
    switch(action) {
        case 'print':
        case 'execute':
        case 'csi_dispatch':
        case 'hook':
        case 'put':
        case 'unhook':
        case 'osc_start':
        case 'osc_put':
        case 'osc_end':
        case 'esc_dispatch':
            this.callback(action, chr);
            break;
        case 'ignore': break;
        case 'collect':
            if ((this.numIntermediateChars + 1) > this.MAX_INTERMEDIATE_CHARS) {
                this.ignoreFlagged = true;
            } else {
                this.intermediateChars[this.numIntermediateChars++] = chr;
            }
            break;
        case 'param':
            if (chr === ';') { // process the param character
                this.numParams += 1;
                this.params[this.numParams - 1] = 0;
            } else { // char is a digit
                var curParam;
                if (this.numParams === 0) {
                    this.numParams = 1;
                    this.params[0] = 0;
                }
                curParam = this.numParams - 1;
                this.params[curParam] *= 10;
            }
        case 'clear':
            this.numIntermediateChars = 0;
            this.numParams = 0;
            this.ignoreFlagged = 0;
            break;
        default:
            this.callback('error', 0);
            break;
    }
}

// Changes state of parser:
//
// 1. exit action from old state
// 2. transition action
// 3. entry action to new state
//
Parser.prototype.changeState = function(newState) {
    if (this.debug) console.log("Changing State to: " + newState);
    var exitAction = Parser.transitions[this.state].exit;
    if (this.debug) console.log("ExitAction: " + exitAction);
    if (exitAction) this.handleAction(exitAction);
    this.state = newState;
    var entryAction = Parser.transitions[newState].entry;
    if (this.debug) console.log("EntryAction: " + entryAction);
    if (entryAction) this.handleAction(entryAction);
}

Parser.prototype.pushChars = function(string) {
    if (string === undefined || string === "") return;
    for (var i = 0; i < string.length; i++) {
        this.pushChar(string[i]);
    }
}

Parser.prototype.pushChar = function(chr) {
    if (chr === undefined) return;

    var transition, action, newState;
    var charCode = chr.charCodeAt(0);
    var parser = this;

    if (this.debug) {
        console.log('Got char: ' + chr);
        console.log('Current State: ' + this.state);
    }

    transition = Parser.transitions['ANYWHERE'][charCode] || Parser.transitions[this.state][charCode];

    action   = transition[0];
    newState = transition[1];
    
    if (action)   this.handleAction(action, chr);
    if (newState) this.changeState(newState);
}

exports.Parser = Parser;
