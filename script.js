const ROWS = 6;
const COLS = 7;
const gridElement = document.getElementById('grid');
const statusElement = document.getElementById('status');

let board = [];
let currentPlayer = 'red';
let gameOver = false;

// Create cells
for (let row = 0; row < ROWS; row++) {
  board[row] = [];
  for (let col = 0; col < COLS; col++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.row = row;
    cell.dataset.col = col;
    gridElement.appendChild(cell);
    board[row][col] = '';
  }
}

function getLowestEmptyRow(col) {
  for (let row = ROWS - 1; row >= 0; row--) {
    if (!board[row][col]) {
      return row;
    }
  }
  return -1;
}

function checkWinner(row, col) {
  function count(dirRow, dirCol) {
    let r = row + dirRow;
    let c = col + dirCol;
    let count = 0;
    while (
      r >= 0 &&
      r < ROWS &&
      c >= 0 &&
      c < COLS &&
      board[r][c] === currentPlayer
    ) {
      count++;
      r += dirRow;
      c += dirCol;
    }
    return count;
  }

  const directions = [
    [0, 1],   // Horizontal
    [1, 0],   // Vertical
    [1, 1],   // Diagonal /
    [1, -1],  // Diagonal \
  ];

  return directions.some(([dr, dc]) =>
    count(dr, dc) + count(-dr, -dc) >= 3
  );
}

gridElement.addEventListener('click', (e) => {
  if (gameOver) return;

  const col = +e.target.dataset.col;
  if (isNaN(col)) return;

  const row = getLowestEmptyRow(col);
  if (row === -1) return;

  board[row][col] = currentPlayer;

  const cell = [...gridElement.children].find(
    (c) => +c.dataset.row === row && +c.dataset.col === col
  );
  cell.classList.add(currentPlayer);

  if (checkWinner(row, col)) {
    statusElement.textContent = `${capitalize(currentPlayer)} Wins!`;
    gameOver = true;
    return;
  }

  currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
  statusElement.textContent = `${capitalize(currentPlayer)}'s Turn`;
});

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
