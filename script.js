let playerName = localStorage.getItem('playerName');
if (!playerName) {
  playerName = prompt('Please enter your name:');
  localStorage.setItem('playerName', playerName);
}
console.log('Player Name:', playerName);
const socket = io('https://tic-tac-toe-server-a5g5.onrender.com', {
  query: {
    name: playerName
  }
});

const cells = document.querySelectorAll('.cell');
const messageDiv = document.querySelector('.message');

cells.forEach(cell => {
  cell.addEventListener('click', handleCellClick);
});


socket.on('connect', () => {
  console.log('Connected to the server');
  messageDiv.textContent = 'Connected!';
});

socket.on('message', (data) => {
  messageDiv.textContent = data.text;
});

socket.on('gameUpdated', (data) => {
  console.log('Game Update:', data);
  if (data.result && data.result.board) {
    updateBoard(data.result.board);
  }
});

socket.on('gameOver', (data) => {
  messageDiv.textContent = data.text;
});


/**
 * Handles the click event on a cell.
 * @param {Event} event - The click event object.
 */
function handleCellClick(event) {
  const index = Array.from(cells).indexOf(event.target);
  socket.emit('move', { index });
}

/**
 * Updates the game board based on the provided board array.
 *
 * @param {Array} board - The game board represented as an array.
 * @returns {void}
 */
function updateBoard(board) { //example board: ['X', 'O', null, 'X', 'O', null, 'X', 'O', null]
  board.forEach((symbol, index) => { //symbol: 'X', index: 0
    cells[index].classList.remove('X', 'O');//remove classes 'X' and 'O' from cell
    if (symbol) {//if symbol is not null
      cells[index].classList.add(symbol);//add class 'X' or 'O' to cell
    }
  });
}
