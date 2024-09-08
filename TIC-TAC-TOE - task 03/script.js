

const cells = document.querySelectorAll('.cell');
const statusDisplay = document.getElementById('status');
const restartBtn = document.getElementById('restartBtn');
const modeSelect = document.getElementById('mode');

let gameActive = true;
let currentPlayer = 'X';
let gameState = ["", "", "", "", "", "", "", "", ""];
let gameMode = 'two-player';

const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

function initializeGame() {
  cells.forEach(cell => {
    cell.classList.remove('X', 'O', 'winner');
    cell.textContent = '';
    cell.removeEventListener('click', handleCellClick);
    cell.addEventListener('click', handleCellClick, { once: true });
  });
  gameActive = true;
  currentPlayer = 'X';
  gameState = ["", "", "", "", "", "", "", "", ""];
  statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
}

function handleCellClick(event) {
  const cell = event.target;
  const cellIndex = parseInt(cell.getAttribute('data-index'));

  if (gameState[cellIndex] !== "" || !gameActive) {
    return;
  }

  updateCell(cell, cellIndex);
  checkResult();

  if (gameActive && gameMode === 'ai' && currentPlayer === 'O') {
    setTimeout(aiMove, 500);
  }
}

function updateCell(cell, index) {
  gameState[index] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.classList.add(currentPlayer);
}

function checkResult() {
  let roundWon = false;
  for (let condition of winningConditions) {
    const [a, b, c] = condition;
    if (
      gameState[a] &&
      gameState[a] === gameState[b] &&
      gameState[a] === gameState[c]
    ) {
      roundWon = true;
      highlightWinningCells(condition);
      break;
    }
  }

  if (roundWon) {
    statusDisplay.textContent = `Player ${currentPlayer} has won!`;
    gameActive = false;
    return;
  }

  if (!gameState.includes("")) {
    statusDisplay.textContent = `It's a draw!`;
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
}

function highlightWinningCells(condition) {
  condition.forEach(index => {
    cells[index].classList.add('winner');
  });
}

restartBtn.addEventListener('click', initializeGame);

modeSelect.addEventListener('change', (e) => {
  gameMode = e.target.value;
  initializeGame();
});

function aiMove() {
  let availableIndices = gameState
    .map((value, index) => value === "" ? index : null)
    .filter(val => val !== null);

  if (availableIndices.length === 0 || !gameActive) {
    return;
  }

  const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
  const cell = document.querySelector(`.cell[data-index='${randomIndex}']`);
  updateCell(cell, randomIndex);
  checkResult();
}

initializeGame();
