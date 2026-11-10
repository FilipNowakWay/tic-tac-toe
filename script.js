// 1. Player Factory
function createPlayer(name, mark) {
  const getName = () => name;
  const getMark = () => mark;
  return { getName, getMark };
}

// 2. Game Board Module (Data & Board Rendering)
const gameBoard = (() => {
  const board_C = document.querySelector(".board");
  const boardArray = ["", "", "", "", "", "", "", "", ""];

  const display = () => {
    board_C.innerHTML = "";
    boardArray.forEach((item, index) => {
      const element = document.createElement("div");
      element.textContent = item;
      element.classList.add("board_entry_piece");
      element.dataset.index = index;
      board_C.appendChild(element);
    });
  };

  const setCell = (index, mark) => {
    if (boardArray[index] === "") {
      boardArray[index] = mark;
      display();
      return true;
    }
    return false;
  };

  const checkWinConditions = () => {
    const winPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    const winningCombo = winPatterns.find(([a, b, c]) => {
      return (
        boardArray[a] !== "" &&
        boardArray[a] === boardArray[b] &&
        boardArray[a] === boardArray[c]
      );
    });
    return winningCombo ? boardArray[winningCombo[0]] : null;
  };

  const getEmptyCount = () => boardArray.filter((item) => item === "").length;

  const resetBoard = () => {
    for (let i = 0; i < boardArray.length; i++) {
      boardArray[i] = "";
    }
    display();
  };

  return {
    display,
    setCell,
    checkWinConditions,
    getEmptyCount,
    resetBoard,
  };
})();

// 3. Game Controller Module (Game Flow & State)
const gameController = (() => {
  const playerArray = [];
  let activePlayerIndex = 0;
  let isGameOver = false;

  const msg = document.querySelector("#msg");
  const restartBox = document.querySelector("#restart");

  const addPlayer = (player) => playerArray.push(player);

  const checkPlayersSet = () => {
    if (playerArray.length < 2) return false;
    return (
      playerArray[0].getName().trim() !== "" &&
      playerArray[1].getName().trim() !== ""
    );
  };

  const getActivePlayer = () => playerArray[activePlayerIndex];

  const switchTurn = () => {
    activePlayerIndex = activePlayerIndex === 0 ? 1 : 0;
    msg.textContent = `Current Player Turn: ${getActivePlayer().getName()}`;
  };

  const renderRestartBtn = () => {
    restartBox.innerHTML = "";
    const newBtn = document.createElement("button");
    newBtn.classList.add("restartBtn");
    newBtn.innerText = "Restart Game";
    newBtn.addEventListener("click", resetGame);
    restartBox.appendChild(newBtn);
  };

  const playRound = (cellIndex) => {
    if (isGameOver) return;

    if (!checkPlayersSet()) {
      msg.textContent = "Please set both player names before playing!";
      return;
    }

    const currentPlayer = getActivePlayer();
    const moveSuccessful = gameBoard.setCell(
      cellIndex,
      currentPlayer.getMark(),
    );
    if (!moveSuccessful) return;

    const winnerMark = gameBoard.checkWinConditions();
    if (winnerMark) {
      msg.textContent = `Player ${currentPlayer.getName()} (${winnerMark}) wins!`;
      isGameOver = true;
      renderRestartBtn();
      return;
    }

    if (gameBoard.getEmptyCount() === 0) {
      msg.textContent = "It's a tie!";
      isGameOver = true;
      renderRestartBtn();
      return;
    }

    switchTurn();
  };

  const resetGame = () => {
    gameBoard.resetBoard();
    playerArray.length = 0;
    activePlayerIndex = 0;
    isGameOver = false;
    restartBox.innerHTML = "";
    msg.textContent = "Enter player names to start a new game!";
  };

  return {
    addPlayer,
    checkPlayersSet,
    playRound,
    getActivePlayer
  };
})();

// Event Listeners
document.querySelector("#inputPlayer").addEventListener("click", (event) => {
  event.preventDefault();

  const player1Input = document.querySelector("#player1Name");
  const player2Input = document.querySelector("#player2Name");

  const p1 = createPlayer(player1Input.value, "X");
  const p2 = createPlayer(player2Input.value, "O");

  gameController.addPlayer(p1);
  gameController.addPlayer(p2);

  if (gameController.checkPlayersSet()) {
    document.querySelector("#msg").textContent =
      `Current Player Turn: ${p1.getName()}`;
  }
});

document.querySelector(".board").addEventListener("click", (e) => {
  const index = e.target.dataset.index;
  if (index !== undefined) {
    gameController.playRound(Number(index));
  }
});

gameBoard.display();
