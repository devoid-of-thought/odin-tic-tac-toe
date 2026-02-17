// Add your JavaScript code here

const gameboardObject = (function () {
  const rows = 3;
  const columns = 3;
  let gameboard = [];
  const initializeGameboard = function () {
    gameboard = [];
    for (let i = 0; i < rows; i++) {
      let row = [];
      for (let j = 0; j < columns; j++) {
        row.push(cell());
      }
      gameboard.push(row);
    }
  };
  const getGameboard = function () {
    return gameboard;
  };
  const showGameboard = function () {
    for (let i = 0; i < rows; i++) {
      let rowValues = [];
      for (let j = 0; j < columns; j++) {
        rowValues.push(gameboard[i][j].getValue());
      }
      console.log(rowValues.join(" | "));
    }
  };
  return { initializeGameboard, getGameboard, showGameboard };
})();
const cell = function () {
  let value = "";
  let isEmpty = true;
  const setValue = function (newValue) {
    value = newValue;
    isEmpty = false;
  };
  const getValue = function () {
    return value;
  };
  const checkIsEmpty = function () {
    return isEmpty;
  };
  return { setValue, getValue, checkIsEmpty };
};
const player = function (name, symbol, score = 0) {
  const changeName = function (newName) {
    name = newName;
  };
  const getName = function () {
    return name;
  };
  const getSymbol = function () {
    return symbol;
  };
  const getScore = function () {
    return score;
  };
  const incrementScore = function () {
    score++;
  };
  return { getName, getSymbol, getScore, incrementScore, changeName };
};
const gameController = (function () {
  let currentPlayer;
  let playerOne = player("Player One", "X", 0);
  let playerTwo = player("Player Two", "O", 0);
  const initializeGame = function (
    playerOneName = "Player One",
    playerTwoName = "Player Two",
  ) {
    playerOne.changeName(playerOneName);
    playerTwo.changeName(playerTwoName);
    gameboardObject.initializeGameboard();
    currentPlayer = playerOne;
    gameboardObject.showGameboard();
    renderBoard();
    console.log(
      `${currentPlayer.getName()}'s turn (${currentPlayer.getSymbol()})`,
    );
  };
  const startGame = function () {
    gameController.initializeGame("PlayerOne", "PlayerTwo", 0, 0);
    const dialog = document.createElement("dialog");
    dialog.classList.add("player-name-dialog");
    dialog.innerHTML = `
            <form method="dialog">
                <label for="playerOne">Player One Name:</label>
                <input type="text" id="playerOne" name="playerOne" placeholder="PlayerOne" required>
                <br>
                <label for="playerTwo">Player Two Name:</label>
                <input type="text" id="playerTwo" name="playerTwo" placeholder="PlayerTwo" required>
                <br>
                <button type="submit">Start Game</button>
            </form>
        `;
    dialog.addEventListener("submit", (e) => {
      e.preventDefault();
      const playerOneName = document.getElementById("playerOne").value;
      const playerTwoName = document.getElementById("playerTwo").value;
      gameController.initializeGame(
        playerOneName,
        playerTwoName,
        playerOne.getScore(),
        playerTwo.getScore(),
      );
      dialog.close();
      dialog.remove();
      updateScores(playerOneName, playerTwoName, playerOne.getScore(), playerTwo.getScore());
    });
    document.body.appendChild(dialog);
    dialog.showModal();
  };
  const switchPlayer = function () {
    currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
  };
  const getCurrentPlayer = function () {
    return currentPlayer;
  };
  const playRound = function (row, column) {
    const gameboard = gameboardObject.getGameboard();
    if (gameboard[row][column].checkIsEmpty()) {
      gameboard[row][column].setValue(currentPlayer.getSymbol());
      gameboardObject.showGameboard();
      renderBoard();
      if (checkWin()) return;
      switchPlayer();
    } else {
      showMessage("Cell is already occupied. Please choose another one.");
      return false;
    }
  };
  const checkWin = function () {
    const gameboard = gameboardObject.getGameboard();
    for (let i = 0; i < 3; i++) {
      if (
        gameboard[i][0].getValue() &&
        gameboard[i][0].getValue() === gameboard[i][1].getValue() &&
        gameboard[i][1].getValue() === gameboard[i][2].getValue()
      ) {
        showMessage(`${currentPlayer.getName()} wins!`, resetBoard);
        currentPlayer === playerOne
          ? playerOne.incrementScore()
          : playerTwo.incrementScore();
        updateScores(
          playerOne.getName(),
          playerTwo.getName(),
          playerOne.getScore(),
          playerTwo.getScore(),
        );
        return true;
      }
      if (
        gameboard[0][i].getValue() &&
        gameboard[0][i].getValue() === gameboard[1][i].getValue() &&
        gameboard[1][i].getValue() === gameboard[2][i].getValue()
      ) {
        showMessage(`${currentPlayer.getName()} wins!`, resetBoard);
        currentPlayer === playerOne
          ? playerOne.incrementScore()
          : playerTwo.incrementScore();
        updateScores(
          playerOne.getName(),
          playerTwo.getName(),
          playerOne.getScore(),
          playerTwo.getScore(),
        );
        return true;
      }
      if (
        gameboard[0][2].getValue() &&
        gameboard[0][2].getValue() === gameboard[1][1].getValue() &&
        gameboard[1][1].getValue() === gameboard[2][0].getValue()
      ) {
        showMessage(`${currentPlayer.getName()} wins!`, resetBoard);
        currentPlayer === playerOne
          ? playerOne.incrementScore()
          : playerTwo.incrementScore();
        updateScores(
          playerOne.getName(),
          playerTwo.getName(),
          playerOne.getScore(),
          playerTwo.getScore(),
        );
        return true;
      }
      if (
        gameboard[0][0].getValue() &&
        gameboard[0][0].getValue() === gameboard[1][1].getValue() &&
        gameboard[1][1].getValue() === gameboard[2][2].getValue()
      ) {
        showMessage(`${currentPlayer.getName()} wins!`, resetBoard);
        currentPlayer === playerOne
          ? playerOne.incrementScore()
          : playerTwo.incrementScore();
        updateScores(
          playerOne.getName(),
          playerTwo.getName(),
          playerOne.getScore(),
          playerTwo.getScore(),
        );
        return true;
      }
    }
    if (gameboard.flat().every((cell) => !cell.checkIsEmpty())) {
      showMessage("It's a draw!", resetBoard);
      return false;
    }
    return false;
  };
  return {
    initializeGame,
    switchPlayer,
    getCurrentPlayer,
    playRound,
    checkWin,
    startGame,
  };
})();
const showMessage = function (message, callback) {
  let dialog = document.createElement("dialog");
  dialog.textContent = message;
  dialog.addEventListener("click", (e) => {
    const dialogDimensions = dialog.getBoundingClientRect();
    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      dialog.close();
      dialog.remove();
      if (callback) callback();
    }
  });
  document.body.appendChild(dialog);
  dialog.showModal();
};

const renderBoard = function () {
  const gameboard = gameboardObject.getGameboard();
  const boardContainer = document.getElementById("gameboard");
  boardContainer.innerHTML = "";
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const cellDiv = document.createElement("div");
      cellDiv.textContent = gameboard[i][j].getValue();
      boardContainer.appendChild(cellDiv);
      cellDiv.addEventListener("click", () => {
        gameController.playRound(i, j);
      });
    }
  }
};
const resetBoard = function () {
  gameboardObject.initializeGameboard();
  renderBoard();
}
const resetBoardButton = document.getElementById("restartButton");
resetBoardButton.addEventListener("click", () => {
  resetBoard();
});
const updateScores = function (
  playerOneName,
  playerTwoName,
  playerOneScore,
  playerTwoScore,
) {
  const playerOneScoreElement = document.getElementById("p1Score");
  const playerTwoScoreElement = document.getElementById("p2Score");
  playerOneScoreElement.textContent = `${playerOneName}: ${playerOneScore}`;
  playerTwoScoreElement.textContent = `${playerTwoName}: ${playerTwoScore}`;
};

gameController.startGame();
