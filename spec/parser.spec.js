var Parser = require('../lib/parser').Parser;

describe('Parser', function(){
    var parser;

    beforeEach(function() { parser = new Parser() })

    it('VT should have actions defined', function(){
        Parser.actions.should.be.instanceof.Object;
    });

    describe('initialization', function(){
        it('should have state GROUND', function(){
            parser.state.should.eql('GROUND');
        });
        ['numIntermediateChars', 'numParams', 'ignoreFlagged'].forEach(function(property) {
            it('should have ' + property + ' set to 0', function(){
                parser[property].should.eql(0);
            });
        });
    });

    describe('actions', function() {
        ['ignore', 'print', 'execute', 'clear', 'collect', 'param', 'csiDispatch', 'escDispatch',
            'hook', 'put', 'unhook', 'oscStart', 'oscPut', 'oscEnd'].forEach(function(action) {
                it('should have ' + action + 'defined as function', function(){ 
                    Parser.actions[action].should.be.a('function');
                });
        });
    });

    describe('states', function() {
        it('should have states', function() {
            Parser.states.should.be.instanceof.Object;
        });

        for (var state in Parser.states) {
            it(state + ' should be a Object', function() {
                Parser.states[state].should.be.a('object');
            });
        }

        describe('ESCAPE', function() {
            it('should have clear action on entry', function() {
                Parser.states.ESCAPE.entry.should.eql(Parser.actions.clear);
            });
        });

        describe('CSI_ENTRY', function() {
            it('should have clear action on entry', function() {
                Parser.states.CSI_ENTRY.entry.should.eql(Parser.actions.clear);
            });
        });

        describe('DCS_ENTRY', function() {
            it('should have clear action on entry', function() {
                Parser.states.DCS_ENTRY.entry.should.eql(Parser.actions.clear);
            });
        });

        describe('DCS_PASSTHROUGH', function() {
            it('should have hook action on entry', function() {
                Parser.states.DCS_PASSTHROUGH.entry.should.eql(Parser.actions.hook);
            });

            it('should have unhook action on exit', function() {
                Parser.states.DCS_PASSTHROUGH.exit.should.eql(Parser.actions.unhook);
            });
        });

        describe('OSC_STRING', function() {
            it('should have oscStart action on entry', function() {
                Parser.states.OSC_STRING.entry.should.eql(Parser.actions.oscStart);
            });

            it('should have oscEnd action on exit', function() {
                Parser.states.OSC_STRING.exit.should.eql(Parser.actions.oscEnd);
            });
        });
    });

    describe('changeState(newState)', function() {
        var called;
        beforeEach(function() {
            called = false
            Parser.states.HELLO = {
                exit:  function() { called = true },
                entry: function() { called = true }
            };
            parser.state = 'HELLO'
        });

        it('should call exit action from old state', function() {
            called.should.be.false;
            parser.changeState('GROUND');
            called.should.be.true;
        });

        it('should change state to newState', function() {
            parser.changeState('GROUND');
            parser.state.should.eql('GROUND');
        });

        it('should call entry action to newState', function() {
            called.should.be.false;
            parser.changeState('HELLO');
            called.should.be.true;
        });
    });

});
