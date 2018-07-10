const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

// expect style in tests 
const expect = chai.expect;

// allow to make HTTP req
chai.use(chaiHttp);

describe('Recipes', function () {
  // before run activate runServer to return a promise
  before(function () {
    return runServer();
  });

  // after done with tests we close server
  after(function () {
    return closeServer();
  });

  it('should list items on GET', function () {
    return chai
      .request(app)
      .get('/recipes')
      .then(function (res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        // since we made at least 1 item on app load
        expect(res.body.length).to.be.at.least(1);
        // should have id, name, ingredients
        const expectedKeys = ['id', 'name', 'checked'];
        res.body.forEach(function (item) {
          expect(item).to.be.a('object');
          expect(item).to.include.keys(expectedKeys);
        })
      });
  });

});
