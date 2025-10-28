const ROW_LETTERS = 'ABCDEFGHI';

class SudokuSolver {
  getCoords(coordinate) {
    const rowChar = coordinate[0]?.toUpperCase();
    const colStr = coordinate[1];
    if (!ROW_LETTERS.includes(rowChar) || !/^[1-9]$/.test(colStr)) {
      return null;
    }
    return {
      row: ROW_LETTERS.indexOf(rowChar),
      col: parseInt(colStr, 10) - 1,
    };
  }

  getRegionStart(coord) {
    return Math.floor(coord / 3) * 3;
  }

  validate(puzzleString) {
    if (!puzzleString || puzzleString.length !== 81) {
      return { error: 'Expected puzzle to be 81 characters long' };
    }
    if (!/^[1-9.]{81}$/.test(puzzleString)) {
      return { error: 'Invalid characters in puzzle' };
    }
    return true;
  }

  checkRowPlacement(puzzleString, row, col, value) {
    for (let c = 0; c < 9; c++) {
      const index = row * 9 + c;
      if (c !== col && puzzleString[index] === value) return false;
    }
    return true;
  }

 checkColPlacement(puzzleString, row, column, value) {
  for (let r = 0; r < 9; r++) {
    const index = r * 9 + column;
    if (puzzleString[index] == value && r !== row) {
      return false;
    }
  }
  return true;
}


  checkRegionPlacement(puzzleString, row, col, value) {
    const startRow = this.getRegionStart(row);
    const startCol = this.getRegionStart(col);
    for (let r = startRow; r < startRow + 3; r++) {
      for (let c = startCol; c < startCol + 3; c++) {
        const index = r * 9 + c;
        if (r === row && c === col) continue;
        if (puzzleString[index] === value) return false;
      }
    }
    return true;
  }

  solve(puzzleString) {
  const findEmpty = puzzleString.indexOf('.');
  if (findEmpty === -1) return puzzleString;

  const row = Math.floor(findEmpty / 9);
  const col = findEmpty % 9;

  for (let num = 1; num <= 9; num++) {
    const val = num.toString();
    if (
      this.checkRowPlacement(puzzleString, row, col, val) &&
      this.checkColPlacement(puzzleString, row, col, val) &&
      this.checkRegionPlacement(puzzleString, row, col, val)
    ) {
      const newPuzzle =
        puzzleString.slice(0, findEmpty) + val + puzzleString.slice(findEmpty + 1);
      const solved = this.solve(newPuzzle);
      if (solved) return solved;
    }
  }
  return false; 
}

}

module.exports = SudokuSolver;
