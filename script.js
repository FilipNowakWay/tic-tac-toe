function createPlayer(name, mark) {
  const getName = () => name;
  const getMark = () => mark;
  return { getName, getMark };
}

const gameController = (() => {
  let = activePlayerIndex = 0;
  let isGameOver = false;
  const playerTurnMsg = document.querySelector("#playerTurn");
  const winStatusMsg = document.querySelector("#winStatus");
  const getActivePlayer = () => gameBoard.getPlayerArray()[activePlayerIndex];

  const switchTurn = () => {
    activePlayerIndex = activePlayerIndex === 0 ? 1 : 0;
    playerTurnMsg.textContent = `Current Player Turn: ${gameBoard.getPlayerArray()[activePlayerIndex].getName()}`;
  };

  const playRound = (cellIndex) => {
    if (isGameOver) return;
    if (!gameBoard.checkPlayersSet()) {
      console.log("Please add both players first!");
      return;
    }

    const currentPlayer = getActivePlayer();

    // Attempt to place mark on board
    const moveSuccessful = gameBoard.setCell(
      cellIndex,
      currentPlayer.getMark(),
    );
    if (!moveSuccessful) return; // Cell was already taken

    // Check for win
    const winnerMark = gameBoard.checkWinCodfitions();
    if (winnerMark) {
      winStatus.textContent = `${currentPlayer.getName()} (${winnerMark}) wins!`;
      isGameOver = true;
      return;
    }

    // Check for tie
    if (gameBoard.getEmptyCount() === 0) {
      console.log("It's a tie!");
      winStatus.textContent = "It's a tie!";
      isGameOver = true;
      return;
    }

    // Switch to next player if game continues
    switchTurn();
    console.log(`It's now ${getActivePlayer().getName()}'s turn.`);
  };

  return { playRound, getActivePlayer };
})();

const gameBoard = (() => {
  // DOM elements
  const board_C = document.querySelector(".board");

  // variables
  const boardArray = ["", "", "", "", "", "", "", "", ""];
  const playerArray = [];

  function display() {
    // Clear before run
    board_C.innerHTML = "";
    // Render
    boardArray.forEach((item, index) => {
      let element = document.createElement("div");
      element.textContent = `${item}`;
      element.classList.add("board_entry_piece");
      element.dataset.index = index;
      board_C.appendChild(element);
    });
  }

  function checkWinCodfitions() {
    const winPatterns = [
      // Rows
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      // Columns
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      // Diagonals
      [0, 4, 8],
      [2, 4, 6],
    ];
    const winningCombo = winPatterns.find(([a, b, c]) => {
      return (
        boardArray[a] !== "" &&
        boardArray[a] === boardArray[b] &&
        boardArray[a] === boardArray[c]
      );
    });
    return winningCombo ? boardArray[winningCombo[0]] : null;
  }

  function checkPlayersSet() {
    if (playerArray.length < 2) return false;
    return (
      playerArray[0].getName().trim() !== "" &&
      playerArray[1].getName().trim() !== ""
    );
  }

  const setCell = (index, mark) => {
    if (boardArray[index] === "") {
      boardArray[index] = mark;
      display();
      return true; // Spot was free
    }
    return false; // Spot already filled
  };

  const getEmptyCount = () => boardArray.filter((item) => item === "").length;
  const addPlayerArray = (player) => playerArray.push(player);
  const getPlayerArray = () => playerArray;

  return {
    display,
    addPlayerArray,
    getPlayerArray,
    checkWinCodfitions,
    getEmptyCount,
    checkPlayersSet,
    gameController,
    setCell,
  };
})();

// Click Events
document.querySelector("#inputPlayer").addEventListener("click", (event) => {
  event.preventDefault();

  const player1Input = document.querySelector("#player1Name");
  const player2Input = document.querySelector("#player2Name");

  const p1 = createPlayer(player1Input.value, "X");
  const p2 = createPlayer(player2Input.value, "O");

  console.log(p1, p2);

  gameBoard.addPlayerArray(p1);
  gameBoard.addPlayerArray(p2);
  console.log("Are players set?", gameBoard.checkPlayersSet());
});

document.querySelector(".board").addEventListener("click", (e) => {
  const index = e.target.dataset.index;
  if (index !== undefined) {
    gameController.playRound(Number(index));
  }
});

gameBoard.display();
