// 1. Player Factory
function createPlayer(name, mark) {
  const getName = () => name;
  const getMark = () => mark;
  return { getName, getMark };
}

// 2. Game Board Module (Data & Logic Only)
const gameBoard = (() => {
  const boardArray = ["", "", "", "", "", "", "", "", ""];

  const setCell = (index, mark) => {
    if (boardArray[index] === "") {
      boardArray[index] = mark;
      return true;
    }
    return false;
  };

  const checkWinConditions = () => {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6]             // Diagonals
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
  };

  const getBoard = () => [...boardArray];

  return {
    setCell,
    checkWinConditions,
    getEmptyCount,
    resetBoard,
    getBoard,
  };
})();

// 3. Display Controller Module (DOM & UI Management)
const displayController = (() => {
  const board_C = document.querySelector(".board");
  const msg = document.querySelector("#msg");
  const restartBox = document.querySelector("#restart");

  const renderBoard = (boardArray) => {
    board_C.innerHTML = "";
    boardArray.forEach((item, index) => {
      const element = document.createElement("div");
      element.textContent = item;
      element.classList.add("board_entry_piece");
      element.dataset.index = index;
      board_C.appendChild(element);
    });
  };

  const setMessage = (text) => {
    msg.textContent = text;
  };

  const renderRestartBtn = (restartCallback) => {
    restartBox.innerHTML = "";
    const newBtn = document.createElement("button");
    newBtn.classList.add("restartBtn");
    newBtn.innerText = "Restart Game";
    newBtn.addEventListener("click", restartCallback);
    restartBox.appendChild(newBtn);
  };

  const clearRestartBtn = () => {
    restartBox.innerHTML = "";
  };

  return {
    renderBoard,
    setMessage,
    renderRestartBtn,
    clearRestartBtn,
  };
})();

// 4. Game Controller Module (State & Orchestration)
const gameController = (() => {
  const playerArray = [];
  let activePlayerIndex = 0;
  let isGameOver = false;

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
    displayController.setMessage(`Current Player Turn: ${getActivePlayer().getName()}`);
  };

  const playRound = (cellIndex) => {
    if (isGameOver) return;

    if (!checkPlayersSet()) {
      displayController.setMessage("Please set both player names before playing!");
      return;
    }

    const currentPlayer = getActivePlayer();
    const moveSuccessful = gameBoard.setCell(cellIndex, currentPlayer.getMark());
    if (!moveSuccessful) return;

    displayController.renderBoard(gameBoard.getBoard());

    const winnerMark = gameBoard.checkWinConditions();
    if (winnerMark) {
      displayController.setMessage(`Player ${currentPlayer.getName()} (${winnerMark}) wins!`);
      isGameOver = true;
      displayController.renderRestartBtn(resetGame);
      return;
    }

    if (gameBoard.getEmptyCount() === 0) {
      displayController.setMessage("It's a tie!");
      isGameOver = true;
      displayController.renderRestartBtn(resetGame);
      return;
    }

    switchTurn();
  };

  const resetGame = () => {
    gameBoard.resetBoard();
    displayController.renderBoard(gameBoard.getBoard());
    playerArray.length = 0;
    activePlayerIndex = 0;
    isGameOver = false;
    displayController.clearRestartBtn();
    displayController.setMessage("Enter player names to start a new game!");
  };

  return {
    addPlayer,
    checkPlayersSet,
    playRound,
    getActivePlayer,
    resetGame,
  };
})();

// 5. Event Listeners
document.querySelector("#inputPlayer").addEventListener("click", (event) => {
  event.preventDefault();

  const player1Input = document.querySelector("#player1Name");
  const player2Input = document.querySelector("#player2Name");

  const p1Name = player1Input.value.trim();
  const p2Name = player2Input.value.trim();

  // Guard clause for empty names
  if (p1Name === "" || p2Name === "") {
    displayController.setMessage("Both player names are required!");
    return;
  }

  // Reset board and active player state before initializing new players
  gameController.resetGame();

  const p1 = createPlayer(p1Name, "X");
  const p2 = createPlayer(p2Name, "O");

  gameController.addPlayer(p1);
  gameController.addPlayer(p2);

  displayController.setMessage(`Current Player Turn: ${p1.getName()}`);
});

document.querySelector(".board").addEventListener("click", (e) => {
  const index = e.target.dataset.index;
  if (index !== undefined) {
    gameController.playRound(Number(index));
  }
});

// Initial Render
displayController.renderBoard(gameBoard.getBoard());
