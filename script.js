const dice = document.getElementById('dice');
const diceImage = document.getElementById('diceImage');
const message = document.getElementById('message');
const saveButton = document.getElementById('save');
const loadButton = document.getElementById('load');
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
  // Play dice roll sound
  diceSound.play();

  // Simulate dice roll animation
  let rolls = 0;
  const rollInterval = setInterval(() => {
    const randomFace = Math.floor(Math.random() * 6) + 1;
    diceImage.src = `images/dice-${randomFace}.png`;
    rolls++;

    // Stop after 5 rolls
    if (rolls > 5) {
      clearInterval(rollInterval);
      const finalRoll = Math.floor(Math.random() * 6) + 1;
      diceImage.src = `images/dice-${finalRoll}.png`;
      message.textContent = `Player ${currentPlayer} rolled a ${finalRoll}`;
      movePlayer(currentPlayer, finalRoll);
      currentPlayer = currentPlayer === 4 ? 1 : currentPlayer + 1;
    }
  }, 100); // Roll every 100ms
});

// Move Player Function
function movePlayer(player, steps) {
  players[player].position += steps;
  if (players[player].position > 56) {
    players[player].position = 56; // End of board
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
