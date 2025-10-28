'use strict';

const Solver = require('../controllers/sudoku-solver.js');
const solver = new Solver();

module.exports = function (app) {

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;

      
      if (!puzzle || !coordinate || !value) {
        return res.json({ error: 'Required field(s) missing' });
      }

      
      if (/[^1-9.]/.test(puzzle)) {
        return res.json({ error: 'Invalid characters in puzzle' });
      }

      
      if (puzzle.length !== 81) {
        return res.json({ error: 'Expected puzzle to be 81 characters long' });
      }

      
      const rowLetter = coordinate[0].toUpperCase();
      const col = Number(coordinate.slice(1));

      if (!/[A-I]/.test(rowLetter) || isNaN(col) || col < 1 || col > 9) {
        return res.json({ error: 'Invalid coordinate' });
      }

     
      if (!/^[1-9]$/.test(value)) {
        return res.json({ error: 'Invalid value' });
      }

      const rowIndex = rowLetter.charCodeAt(0) - 65;
      const colIndex = col - 1;

      
      const cellIndex = rowIndex * 9 + colIndex;
      if (puzzle[cellIndex] === value) {
        return res.json({ valid: true });
      }

    
      const conflicts = [];

      if (!solver.checkRowPlacement(puzzle, rowIndex, colIndex, value)) {
        conflicts.push('row');
      }
      if (!solver.checkColPlacement(puzzle, rowIndex, colIndex, value)) {
        conflicts.push('column');
      }
      if (!solver.checkRegionPlacement(puzzle, rowIndex, colIndex, value)) {
        conflicts.push('region');
      }

      if (conflicts.length > 0) {
        return res.json({ valid: false, conflict: conflicts });
      }

      return res.json({ valid: true });
    });

  // ================================================================

  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body;

      if (!puzzle) {
        return res.json({ error: 'Required field missing' });
      }

     
      if (/[^1-9.]/.test(puzzle)) {
        return res.json({ error: 'Invalid characters in puzzle' });
      }

      
      if (puzzle.length !== 81) {
        return res.json({ error: 'Expected puzzle to be 81 characters long' });
      }

     
      const solution = solver.solve(puzzle);

      if (!solution) {
        return res.json({ error: 'Puzzle cannot be solved' });
      }

      return res.json({ solution });
    });
};
