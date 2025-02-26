const dice = document.getElementById('dice');
const diceImage = document.getElementById('diceImage');
const message = document.getElementById('message');
const saveButton = document.getElementById('save');
const loadButton = document.getElementById('load');
const aiDifficulty = document.getElementById('aiDifficulty');
const diceSound = document.getElementById('diceSound');
const moveSound = document.getElementById('moveSound');
const winSound = document.getElementById('winSound');
const clickSound = document.getElementById('clickSound');
const backgroundMusic = document.getElementById('backgroundMusic');

let currentPlayer = 1;
let players = {
  1: { position: 0 },
  2: { position: 0 },
  3: { position: 0 },
  4: { position: 0 },
};

// Play background music
backgroundMusic.play();

// Dice Roll Function
dice.addEventListener('click', () => {
  if (currentPlayer === 1) { // Only allow human player to roll
    diceSound.play();
    rollDice();
  }
});

// Roll Dice Logic
function rollDice() {
  let rolls = 0;
  const rollInterval = setInterval(() => {
    const randomFace = Math.floor(Math.random() * 6) + 1;
    diceImage.src = `images/dice-${randomFace}.png`;
    rolls++;

    if (rolls > 5) {
      clearInterval(rollInterval);
      const finalRoll = Math.floor(Math.random() * 6) + 1;
      diceImage.src = `images/dice-${finalRoll}.png`;
      message.textContent = `Player ${currentPlayer} rolled a ${finalRoll}`;
      movePlayer(currentPlayer, finalRoll);
      if (finalRoll !== 6) {
        currentPlayer = currentPlayer === 4 ? 1 : currentPlayer + 1;
      }
      if (currentPlayer !== 1) {
        setTimeout(() => aiMove(currentPlayer), 1000);
      }
    }
  }, 100);
}

// AI Move Logic
function aiMove(player) {
  const difficulty = aiDifficulty.value;
  let steps;

  if (difficulty === 'easy') {
    steps = Math.floor(Math.random() * 6) + 1;
  } else if (difficulty === 'medium') {
    steps = Math.min(6, 56 - players[player].position);
  } else if (difficulty === 'hard') {
    steps = Math.min(6, 56 - players[player].position);
    if (steps === 0) steps = 1;
  }

  diceImage.src = `images/dice-${steps}.png`;
  message.textContent = `Player ${player} rolled a ${steps}`;
  movePlayer(player, steps);
  if (steps !== 6) {
    currentPlayer = currentPlayer === 4 ? 1 : currentPlayer + 1;
  }
  if (currentPlayer !== 1) {
    setTimeout(() => aiMove(currentPlayer), 1000);
  }
}

// Move Player Function
function movePlayer(player, steps) {
  players[player].position += steps;
  if (players[player].position > 56) {
    players[player].position = 56;
    message.textContent = `Player ${player} has reached the end!`;
    winSound.play();
  }
  moveSound.play();
  updateBoard();
}

// Update Board Function
function updateBoard() {
  const cells = document.querySelectorAll('.cell');
  cells.forEach(cell => {
    cell.textContent = '';
    cell.style.backgroundColor = '#fff';
  });

  for (const [player, data] of Object.entries(players)) {
    const cell = document.querySelector(`.cell:nth-child(${data.position + 1})`);
    if (cell) {
      cell.textContent = player;
      cell.style.backgroundColor = getPlayerColor(player);
    }
  }
}

// Get Player Color
function getPlayerColor(player) {
  const colors = {
    1: 'red',
    2: 'green',
    3: 'blue',
    4: 'yellow',
  };
  return colors[player];
}

// Save Game
saveButton.addEventListener('click', () => {
  localStorage.setItem('ludoGameState', JSON.stringify(players));
  message.textContent = 'Game saved!';
  clickSound.play();
});

// Load Game
loadButton.addEventListener('click', () => {
  const savedState = localStorage.getItem('ludoGameState');
  if (savedState) {
    players = JSON.parse(savedState);
    updateBoard();
    message.textContent = 'Game loaded!';
  } else {
    message.textContent = 'No saved game found!';
  }
  clickSound.play();
});
