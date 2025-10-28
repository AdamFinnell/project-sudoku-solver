const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

const { puzzlesAndSolutions } = require('../controllers/puzzle-strings.js');

suite('Functional Tests', () => {

  test('Solve a puzzle with valid puzzle string: POST request to /api/solve', function(done) {
    chai
      .request(server)
      .post('/api/solve')
      .send({ puzzle: puzzlesAndSolutions[0][0] })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, 'solution');
        assert.equal(res.body.solution, puzzlesAndSolutions[0][1]);
        done();
      });
  });

  test('Solve a puzzle with missing puzzle string: POST request to /api/solve', function(done) {
    chai
      .request(server)
      .post('/api/solve')
      .send({})
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Required field missing');
        done();
      });
  });

  test('Solve a puzzle with invalid characters: POST request to /api/solve', function(done) {
    chai
      .request(server)
      .post('/api/solve')
      .send({ puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.X' })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Invalid characters in puzzle');
        done();
      });
  });

  test('Solve a puzzle with incorrect length: POST request to /api/solve', function(done) {
    chai
      .request(server)
      .post('/api/solve')
      .send({ puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.' })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
        done();
      });
  });

  test('Solve a puzzle that cannot be solved: POST request to /api/solve', function(done) {
    chai
      .request(server)
      .post('/api/solve')
      .send({ puzzle: '115..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.' })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Puzzle cannot be solved');
        done();
      });
  });

  test('Check a puzzle placement with all fields: POST request to /api/check', function(done) {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: puzzlesAndSolutions[0][0],
        coordinate: 'A1',
        value: '7'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, 'valid');
        assert.isTrue(res.body.valid);
        done();
      });
  });

  test('Check a puzzle placement with single placement conflict: POST request to /api/check', function(done) {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: puzzlesAndSolutions[0][0],
        coordinate: 'A1',
        value: '6'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, 'valid');
        assert.isFalse(res.body.valid);
        assert.property(res.body, 'conflict');
        assert.isArray(res.body.conflict);
        assert.lengthOf(res.body.conflict, 1);
        done();
      });
  });

  test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', function(done) {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: puzzlesAndSolutions[0][0],
        coordinate: 'A1',
        value: '1'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, 'valid');
        assert.isFalse(res.body.valid);
        assert.property(res.body, 'conflict');
        assert.isArray(res.body.conflict);
        assert.isAbove(res.body.conflict.length, 1);
        done();
      });
  });

  test('Check a puzzle placement with all placement conflicts: POST request to /api/check', function(done) {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: puzzlesAndSolutions[0][0],
        coordinate: 'A1',
        value: '5'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, 'valid');
        assert.isFalse(res.body.valid);
        assert.property(res.body, 'conflict');
        assert.isArray(res.body.conflict);
        assert.lengthOf(res.body.conflict, 3);
        done();
      });
  });

  test('Check a puzzle placement with missing required fields: POST request to /api/check', function(done) {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: puzzlesAndSolutions[0][0],
        coordinate: 'A1'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Required field(s) missing');
        done();
      });
  });

  test('Check a puzzle placement with invalid characters: POST request to /api/check', function(done) {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.X',
        coordinate: 'A1',
        value: '7'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Invalid characters in puzzle');
        done();
      });
  });

  test('Check a puzzle placement with incorrect length: POST request to /api/check', function(done) {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.',
        coordinate: 'A1',
        value: '7'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
        done();
      });
  });

  test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', function(done) {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: puzzlesAndSolutions[0][0],
        coordinate: 'Z1',
        value: '7'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Invalid coordinate');
        done();
      });
  });

  test('Check a puzzle placement with invalid placement value: POST request to /api/check', function(done) {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle: puzzlesAndSolutions[0][0],
        coordinate: 'A1',
        value: '0'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Invalid value');
        done();
      });
  });

});