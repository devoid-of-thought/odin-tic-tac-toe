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
const player = function (name, symbol) {
  const getName = function () {
    return name;
  };
  const getSymbol = function () {
    return symbol;
  };
  return { getName, getSymbol };
};
const gameController = (function (
  playerOneName = "PlayerOne",
  playerTwoName = "PlayerTwo",
) {
  let currentPlayer;
  const playerOne = player(playerOneName, "X");
  const playerTwo = player(playerTwoName, "O");
  const initializeGame = function () {
    gameboardObject.initializeGameboard();
    currentPlayer = playerOne;
    gameboardObject.showGameboard();
    renderBoard();
    console.log(
      `${currentPlayer.getName()}'s turn (${currentPlayer.getSymbol()})`,
    );
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
      console.log(
        `${currentPlayer.getName()}'s turn (${currentPlayer.getSymbol()})`,
      );
    } else {
        showMessage("Cell is already occupied. Please choose another one.");
      return false;    }
  };
  const checkWin = function () {
    const gameboard = gameboardObject.getGameboard();
    for (let i = 0; i < 3; i++) {
      if (
        gameboard[i][0].getValue() &&
        gameboard[i][0].getValue() === gameboard[i][1].getValue() &&
        gameboard[i][1].getValue() === gameboard[i][2].getValue()
      ) {
        showMessage(`${currentPlayer.getName()} wins!`);    
        return true;
      }
      if (
        gameboard[0][i].getValue() &&
        gameboard[0][i].getValue() === gameboard[1][i].getValue() &&
        gameboard[1][i].getValue() === gameboard[2][i].getValue()
      ) {
        showMessage(`${currentPlayer.getName()} wins!`);    
        return true;
      }
      if (
        gameboard[0][2].getValue() &&
        gameboard[0][2].getValue() === gameboard[1][1].getValue() &&
        gameboard[1][1].getValue() === gameboard[2][0].getValue()
      ) {
        showMessage(`${currentPlayer.getName()} wins!`);    
        return true;
      }
      if (
        gameboard[0][0].getValue() &&
        gameboard[0][0].getValue() === gameboard[1][1].getValue() &&
        gameboard[1][1].getValue() === gameboard[2][2].getValue()
      ) {
        showMessage(`${currentPlayer.getName()} wins!`  );    
        return true;
      }
    }
    if (gameboard.flat().every((cell) => !cell.checkIsEmpty())) {
        showMessage("It's a draw!");
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
  };
})();
const showMessage = function (message) {
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
    }
  });
  document.body.appendChild(dialog);
  dialog.showModal();
}

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
gameController.initializeGame();
