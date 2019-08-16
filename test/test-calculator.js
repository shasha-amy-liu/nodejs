const calculator = require('../src/lib/calculator.js');
const expect = require('chai').expect

it('Test calculate SMA', function(done) {
    const data = [];
    for (let i = 1; i < 10; i++) {
        data.push({'close' : i});
    }
    expect(calculator.calculateSMA(data)).to.equal('5.0000');
    done();
});

it('Test calculate RSI', function(done) {
    const data = [];
    for (let i = 1; i < 10; i++) {
        data.push({'close' : i});
    }
    
    expect(calculator.calculateRSI(data)).to.equal('100.0000')
    done();
});