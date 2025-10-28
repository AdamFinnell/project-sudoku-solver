const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

const { puzzlesAndSolutions } = require('../controllers/puzzle-strings.js');

suite('Unit Tests', () => {
  
  test('Logic handles a valid puzzle string of 81 characters', function(done) {
    const input = puzzlesAndSolutions[0][0];
    const result = solver.validate(input);
    assert.isTrue(result);
    done();
  });

  test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', function(done) {
    const input = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37X';
    const result = solver.validate(input);
    assert.isObject(result);
    assert.property(result, 'error');
    assert.equal(result.error, 'Invalid characters in puzzle');
    done();
  });

  test('Logic handles a puzzle string that is not 81 characters in length', function(done) {
    const input = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37';
    const result = solver.validate(input);
    assert.isObject(result);
    assert.property(result, 'error');
    assert.equal(result.error, 'Expected puzzle to be 81 characters long');
    done();
  });

  test('Logic handles a valid row placement', function(done) {
    const puzzle = puzzlesAndSolutions[0][0];
    const row = 0;
    const col = 0;
    const value = '7';
    const result = solver.checkRowPlacement(puzzle, row, col, value);
    assert.isTrue(result);
    done();
  });

  test('Logic handles an invalid row placement', function(done) {
    const puzzle = puzzlesAndSolutions[0][0];
    const row = 0;
    const col = 0;
    const value = '5'; 
    const result = solver.checkRowPlacement(puzzle, row, col, value);
    assert.isFalse(result);
    done();
  });

  test('Logic handles a valid column placement', function(done) {
    const puzzle = puzzlesAndSolutions[0][0];
    const row = 0;
    const col = 0;
    const value = '7';
    const result = solver.checkColPlacement(puzzle, row, col, value);
    assert.isTrue(result);
    done();
  });

  test('Logic handles an invalid column placement', function(done) {
    const puzzle = puzzlesAndSolutions[0][0];
    const row = 0;
    const col = 0;
    const value = '8';
    const result = solver.checkColPlacement(puzzle, row, col, value);
    assert.isFalse(result);
    done();
  });

  test('Logic handles a valid region (3x3 grid) placement', function(done) {
    const puzzle = puzzlesAndSolutions[0][0];
    const row = 0;
    const col = 0;
    const value = '7';
    const result = solver.checkRegionPlacement(puzzle, row, col, value);
    assert.isTrue(result);
    done();
  });

  test('Logic handles an invalid region (3x3 grid) placement', function(done) {
    const puzzle = puzzlesAndSolutions[0][0];
    const row = 0;
    const col = 0;
    const value = '8';
    const result = solver.checkRegionPlacement(puzzle, row, col, value);
    assert.isFalse(result);
    done();
  });

  test('Valid puzzle strings pass the solver', function(done) {
    const input = puzzlesAndSolutions[0][0];
    const solution = solver.solve(input);
    assert.isString(solution);
    assert.lengthOf(solution, 81);
    done();
  });

  test('Invalid puzzle strings fail the solver', function(done) {
    const input = '115..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const result = solver.solve(input);
    assert.isFalse(result);
    done();
  });

  test('Solver returns the expected solution for an incomplete puzzle', function(done) {
    const input = puzzlesAndSolutions[0][0];
    const expected = puzzlesAndSolutions[0][1];
    const solution = solver.solve(input);
    assert.equal(solution, expected);
    done();
  });
});