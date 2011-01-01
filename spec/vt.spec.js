var VT = require('../src/vt').VT;

describe('VT', function(){
    it('should be object', function(){
        (typeof VT === 'object').should.be.true;
    });
});
