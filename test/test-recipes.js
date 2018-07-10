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

  // GET: make request to recipes and inspect response if correct
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
        const expectedKeys = ['id', 'name', 'ingredients'];
        res.body.forEach(function (item) {
          expect(item).to.be.a('object');
          expect(item).to.include.keys(expectedKeys);
        })
      });
  });

  // POST: make post req and check if has right status code and requirements
  it('should add item on POST', function () {
    const newItem = {name: 'pizza bites', ingredients: ['pillsbury dough', 'peperoni']};
    return chai
      .request(app)
      .post('/recipes')
      .send(newItem)
      .then(function (res) {
        expect(res).to.have.status(201);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.include.keys('id', 'name', 'ingredients');
        expect(res.body.id).to.not.equal(null);
        // response should be deep equal to newItem if assign id to it
        expect(res.body).to.deep.equal(
          Object.assign(newItem, {id: res.body.id})
        );
      });
  });

  // PUT: init some update data, make GET to grab item to update
  // add id to updateData
  // make a PUT req with data and inspect res to have right 
  // status code and data
  it('should update items on PUT', function () {
    const updateData = {
      name: 'bar',
      ingredients: ['foo', 'bar', 'baz']
    };

    return (
      chai
        .request(app)
        .get('/recipes')
        .then(function (res) {
          updateData.id = res.body[0].id;
          // return a promise whose val be res object. Inspect in .then
          return chai
            .request(app)
            .put(`/recipes/${updateData.id}`)
            .send(updateData);
        })
        // show PUT req has right status code
        .then(function (res) {
          expect(res).to.have.status(204);
          // expect(res).to.be.json;
          // expect(res.body).to.be.a('object');
          // expect(res.body).to.deep.equal(updateData);
        })
    );
  });



});
