const expect  = require('chai').expect;
const request = require('request');
require('should-http');

beforeEach(function () {
  // start server and listen port 9999
  server = require('../src/lib/server.js')();
});

it('Test load index page', function(done) {
    request('http://localhost:9999' , function(error, response, body) {
        response.should.have.status(200);
        done();
    });
});

it('Test valid input', function(done) {
    request('http://localhost:9999/calculator/TSLA', function(error, response, body) {
        response.should.have.status(200);
        done();
    });
});

it('Test invalid input', function(done) {
    request('http://localhost:9999/calculator/BOOOO', function(error, response, body) {
        // console.log(response.data)
        // expect(response.data.length).to.equal(1);
        response.should.have.status(400);
        done();
    });
});

afterEach(function(done) {
    // runs after all tests in this block
    console.log('shut down server every time!');
    server.close(done)
});